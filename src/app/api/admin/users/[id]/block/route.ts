import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard();
  if (guard) return guard;

  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (id === session!.user.id) {
    return NextResponse.json({ message: "Cannot block yourself" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const isBlocked = body.isBlocked !== undefined ? Boolean(body.isBlocked) : !user.isBlocked;

  const updated = await prisma.user.update({
    where: { id },
    data: { isBlocked },
    select: { id: true, email: true, isBlocked: true },
  });

  return NextResponse.json(updated);
}
