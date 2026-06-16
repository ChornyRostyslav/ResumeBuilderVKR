import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class ResumeRepository {
  async togglePublicStatus(id: string, userId: string, isPublic: boolean, shareId: string | null) {
    return prisma.resume.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        isPublic,
        shareId,
      },
    });
  }

  async findByShareId(shareId: string) {
    return prisma.resume.findUnique({
      where: {
        shareId,
        isPublic: true,
      },
    });
  }

  async findPublicResumes(search: string, category: string, limit: number, offset: number) {
    const searchStr = search ? `%${search}%` : '%';
    const categoryStr = category ? `%${category}%` : '%';

    const resumes = await prisma.$queryRaw`
      SELECT id, title, "firstName", "lastName", "desiredRole", skills, "shareId"
      FROM "Resume"
      WHERE "isPublic" = true
      AND (
        COALESCE("desiredRole", '') ILIKE ${searchStr} OR
        array_to_string(skills, ',') ILIKE ${searchStr}
      )
      AND (
        COALESCE("desiredRole", '') ILIKE ${categoryStr}
      )
      ORDER BY "createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery: any[] = await prisma.$queryRaw`
      SELECT COUNT(*)::int as count
      FROM "Resume"
      WHERE "isPublic" = true
      AND (
        COALESCE("desiredRole", '') ILIKE ${searchStr} OR
        array_to_string(skills, ',') ILIKE ${searchStr}
      )
      AND (
        COALESCE("desiredRole", '') ILIKE ${categoryStr}
      )
    `;

    return {
      data: resumes as any[],
      total: countQuery[0].count,
    };
  }
}

export const resumeRepository = new ResumeRepository();
