import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";
import { prisma } from "@/lib/db";

export async function GET() {
  const guard = await adminGuard();
  if (guard) return guard;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersLast30Days,
    totalResumes,
    totalTemplates,
    publishedTemplates,
    blockedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.resume.count(),
    prisma.template.count(),
    prisma.template.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { isBlocked: true } }),
  ]);

  // Template popularity: count resumes per template value
  const templateUsage = await prisma.resume.groupBy({
    by: ["template"],
    _count: { template: true },
    orderBy: { _count: { template: "desc" } },
    take: 5,
  });

  return NextResponse.json({
    totalUsers,
    newUsersLast30Days,
    totalResumes,
    totalTemplates,
    publishedTemplates,
    blockedUsers,
    templateUsage: templateUsage.map((t) => ({
      template: t.template,
      count: t._count.template,
    })),
  });
}
