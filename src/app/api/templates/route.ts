import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public endpoint: returns only published templates so they can be offered
// to users in the resume builder's design step.
export async function GET() {
  const templates = await prisma.template.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      category: true,
      previewUrl: true,
    },
  });

  return NextResponse.json(templates);
}
