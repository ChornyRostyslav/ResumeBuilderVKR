import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";
import { prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json();
  const { name, category, previewUrl, isPublished } = body;

  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const template = await prisma.template.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      category: category ?? existing.category,
      previewUrl: previewUrl !== undefined ? previewUrl : existing.previewUrl,
      isPublished: isPublished !== undefined ? isPublished : existing.isPublished,
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  const { id } = await params;

  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ message: "Template deleted" });
}
