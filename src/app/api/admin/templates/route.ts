import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";
import { prisma } from "@/lib/db";

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(templates);
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if (guard) return guard;

  const body = await req.json();
  const { name, category, previewUrl, isPublished } = body;

  if (!name || !category) {
    return NextResponse.json({ message: "Name and category are required" }, { status: 400 });
  }

  const template = await prisma.template.create({
    data: {
      name,
      category,
      previewUrl: previewUrl || null,
      isPublished: isPublished ?? false,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
