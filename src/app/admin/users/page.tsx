import { adminGuard } from "@/lib/adminGuard";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { UsersClient } from "@/components/admin/UsersClient";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const guard = await adminGuard();
  if (guard) redirect("/login");

  const { page: pageParam, search = "" } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const limit = 20;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        _count: { select: { resumes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Користувачі</h1>
      <UsersClient
        initialUsers={users}
        total={total}
        page={page}
        limit={limit}
        search={search}
      />
    </div>
  );
}
