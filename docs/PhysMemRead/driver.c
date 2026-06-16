/*
 * PhysMemRead — kernel driver
 * Reads physical memory of a target process by walking x64 page tables.
 *
 * Build: WDK + VS, x64 Release, Kernel Mode Driver (KMDF not required)
 * Load:  sc create / OSR Driver Loader (test-signing must be ON)
 *
 * Tested layout: Windows 11 25H2 x64
 *   EPROCESS.DirectoryTableBase  offset 0x28
 */

#include <ntddk.h>

/* -----------------------------------------------------------------------
 * Constants
 * --------------------------------------------------------------------- */
#define DRIVER_TAG          'pMRD'

/* Page-table entry flag bits */
#define PTE_PRESENT         0x0000000000000001ULL
#define PTE_LARGE_PAGE      0x0000000000000080ULL

/* Mask that keeps the 4-KB-aligned physical frame address from a PTE */
#define PTE_FRAME_MASK      0x000FFFFFFFFFF000ULL

/* EPROCESS.DirectoryTableBase offset (x64, Win 10 1607 – Win 11 25H2) */
#define EPROC_DTB_OFFSET    0x28

/* -----------------------------------------------------------------------
 * Virtual-address bit-field decomposition (IA-32e 4-level paging)
 *
 *  63..48  sign extension (must match bit 47)
 *  47..39  PML4 index   (9 bits)
 *  38..30  PDPT  index  (9 bits)
 *  29..21  PD    index  (9 bits)
 *  20..12  PT    index  (9 bits)
 *  11..0   page  offset (12 bits)
 * --------------------------------------------------------------------- */
typedef union _VA64 {
    ULONG64 Value;
    struct {
        ULONG64 PageOffset : 12;
        ULONG64 PtIndex    :  9;
        ULONG64 PdIndex    :  9;
        ULONG64 PdptIndex  :  9;
        ULONG64 Pml4Index  :  9;
        ULONG64 Reserved   : 16;
    };
} VA64;

/* -----------------------------------------------------------------------
 * ReadPhys — map a physical address, copy Size bytes, unmap
 * --------------------------------------------------------------------- */
static NTSTATUS
ReadPhys(ULONG64 PhysAddr, PVOID Buffer, SIZE_T Size)
{
    PHYSICAL_ADDRESS pa;
    pa.QuadPart = (LONGLONG)PhysAddr;

    PVOID mapped = MmMapIoSpaceEx(pa, Size, PAGE_READONLY | PAGE_NOCACHE);
    if (!mapped)
        return STATUS_INSUFFICIENT_RESOURCES;

    RtlCopyMemory(Buffer, mapped, Size);
    MmUnmapIoSpace(mapped, Size);
    return STATUS_SUCCESS;
}

/* -----------------------------------------------------------------------
 * VaToPhys — walk PML4 → PDPT → PD → PT to obtain a physical address
 *
 *  Cr3       — value of DirectoryTableBase from EPROCESS (= CR3 frame)
 *  Va        — target virtual address (user-mode or kernel)
 *  PhysOut   — receives the translated physical address
 * --------------------------------------------------------------------- */
static NTSTATUS
VaToPhys(ULONG64 Cr3, ULONG64 Va, PULONG64 PhysOut)
{
    VA64    va  = { .Value = Va };
    ULONG64 pte = 0;
    NTSTATUS s;

    /* Helper: read one 8-byte PTE from physical address BasePhys + Index*8 */
#define READ_PTE(BasePhys, Index)                                           \
    do {                                                                    \
        s = ReadPhys(((BasePhys) & PTE_FRAME_MASK) + (ULONG64)(Index) * 8, \
                     &pte, sizeof(pte));                                    \
        if (!NT_SUCCESS(s)) {                                               \
            DbgPrint("[pmread] ReadPhys failed at 0x%016llX: 0x%08X\n",    \
                     ((BasePhys) & PTE_FRAME_MASK) + (ULONG64)(Index) * 8, \
                     s);                                                    \
            return STATUS_INVALID_ADDRESS;                                  \
        }                                                                   \
        if (!(pte & PTE_PRESENT)) {                                         \
            DbgPrint("[pmread] PTE not present (base=0x%016llX idx=%llu)\n",\
                     (BasePhys), (ULONG64)(Index));                         \
            return STATUS_INVALID_ADDRESS;                                  \
        }                                                                   \
    } while (0)

    /* Level 4 — PML4 */
    READ_PTE(Cr3, va.Pml4Index);
    DbgPrint("[pmread] PML4E[%llu] = 0x%016llX\n", (ULONG64)va.Pml4Index, pte);

    /* Level 3 — PDPT */
    READ_PTE(pte, va.PdptIndex);
    DbgPrint("[pmread] PDPTE[%llu] = 0x%016llX\n", (ULONG64)va.PdptIndex, pte);

    if (pte & PTE_LARGE_PAGE) {
        /* 1 GB huge page — bits 29..0 come from VA */
        *PhysOut = (pte & 0x000FFFFFC0000000ULL) | (Va & 0x3FFFFFFFULL);
        DbgPrint("[pmread] -> 1 GB page, PA = 0x%016llX\n", *PhysOut);
        return STATUS_SUCCESS;
    }

    /* Level 2 — PD */
    READ_PTE(pte, va.PdIndex);
    DbgPrint("[pmread] PDE  [%llu] = 0x%016llX\n", (ULONG64)va.PdIndex, pte);

    if (pte & PTE_LARGE_PAGE) {
        /* 2 MB large page — bits 20..0 come from VA */
        *PhysOut = (pte & 0x000FFFFFFFE00000ULL) | (Va & 0x1FFFFFULL);
        DbgPrint("[pmread] -> 2 MB page, PA = 0x%016llX\n", *PhysOut);
        return STATUS_SUCCESS;
    }

    /* Level 1 — PT */
    READ_PTE(pte, va.PtIndex);
    DbgPrint("[pmread] PTE  [%llu] = 0x%016llX\n", (ULONG64)va.PtIndex, pte);

#undef READ_PTE

    /* 4 KB page — add the 12-bit page offset */
    *PhysOut = (pte & PTE_FRAME_MASK) | va.PageOffset;
    DbgPrint("[pmread] -> 4 KB page, PA = 0x%016llX\n", *PhysOut);
    return STATUS_SUCCESS;
}

/* -----------------------------------------------------------------------
 * ReadTargetVa — full pipeline: PID → CR3 → page-walk → read bytes
 * --------------------------------------------------------------------- */
static NTSTATUS
ReadTargetVa(ULONG TargetPid, ULONG64 TargetVa, PVOID OutBuf, SIZE_T ReadSize)
{
    /* 1. Resolve EPROCESS from PID */
    PEPROCESS process = NULL;
    NTSTATUS status = PsLookupProcessByProcessId(
                          (HANDLE)(ULONG_PTR)TargetPid, &process);
    if (!NT_SUCCESS(status)) {
        DbgPrint("[pmread] PsLookupProcessByProcessId(%lu) failed: 0x%08X\n",
                 TargetPid, status);
        return status;
    }

    /* 2. Read DirectoryTableBase (CR3) from EPROCESS */
    ULONG64 cr3 = *(ULONG64*)((PUCHAR)process + EPROC_DTB_OFFSET);
    DbgPrint("[pmread] PID %lu  EPROCESS=0x%p  CR3=0x%016llX\n",
             TargetPid, process, cr3);
    ObDereferenceObject(process);

    /* Sanity: CR3 must be 4-KB aligned and non-zero */
    if (!cr3 || (cr3 & 0xFFF)) {
        DbgPrint("[pmread] Invalid CR3 value\n");
        return STATUS_INVALID_ADDRESS;
    }

    /* 3. Walk page tables */
    ULONG64 physAddr = 0;
    status = VaToPhys(cr3, TargetVa, &physAddr);
    if (!NT_SUCCESS(status)) {
        DbgPrint("[pmread] Page-table walk failed for VA 0x%016llX\n", TargetVa);
        return status;
    }

    DbgPrint("[pmread] VA 0x%016llX  ->  PA 0x%016llX\n", TargetVa, physAddr);

    /* 4. Read bytes from the resolved physical address */
    status = ReadPhys(physAddr, OutBuf, ReadSize);
    if (!NT_SUCCESS(status)) {
        DbgPrint("[pmread] ReadPhys(PA=0x%016llX, Size=%zu) failed: 0x%08X\n",
                 physAddr, ReadSize, status);
    }
    return status;
}

/* -----------------------------------------------------------------------
 * DriverUnload
 * --------------------------------------------------------------------- */
VOID DriverUnload(PDRIVER_OBJECT DriverObject)
{
    UNREFERENCED_PARAMETER(DriverObject);
    DbgPrint("[pmread] Driver unloaded\n");
}

/* -----------------------------------------------------------------------
 * DriverEntry — change the three TARGET_* values below as needed
 * --------------------------------------------------------------------- */
NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath)
{
    UNREFERENCED_PARAMETER(RegistryPath);
    DriverObject->DriverUnload = DriverUnload;

    DbgPrint("[pmread] ========================================\n");
    DbgPrint("[pmread] Physical Memory Reader loaded\n");

    /* ---- CONFIGURE TARGET HERE ---- */
    const ULONG   TARGET_PID  = 5448;
    const ULONG64 TARGET_VA   = 0x00000034DFFCF9C4ULL;
    const SIZE_T  READ_SIZE   = 8;   /* bytes to read; adjust as needed */
    /* -------------------------------- */

    UCHAR buf[16] = { 0 };
    if (READ_SIZE > sizeof(buf)) {
        DbgPrint("[pmread] READ_SIZE exceeds local buffer\n");
        return STATUS_SUCCESS;
    }

    NTSTATUS status = ReadTargetVa(TARGET_PID, TARGET_VA, buf, READ_SIZE);
    if (!NT_SUCCESS(status)) {
        DbgPrint("[pmread] ReadTargetVa failed: 0x%08X\n", status);
        return STATUS_SUCCESS;   /* return success so driver stays loaded */
    }

    /* Print individual bytes */
    DbgPrint("[pmread] Read %zu byte(s) from [PID %lu] VA 0x%016llX:\n",
             READ_SIZE, TARGET_PID, TARGET_VA);

    for (SIZE_T i = 0; i < READ_SIZE; i++)
        DbgPrint("[pmread]   [+%02zu]  0x%02X\n", i, buf[i]);

    /* Also print as ULONG64 (little-endian) if we read 8 bytes */
    if (READ_SIZE >= 8) {
        ULONG64 value = *(ULONG64*)buf;
        DbgPrint("[pmread] As UINT64 (LE): 0x%016llX\n", value);
        DbgPrint("[pmread] Expected byte:  0xAA  Got: 0x%02X  -> %s\n",
                 buf[0],
                 buf[0] == 0xAA ? "MATCH" : "MISMATCH");
    }

    DbgPrint("[pmread] ========================================\n");
    return STATUS_SUCCESS;
}
