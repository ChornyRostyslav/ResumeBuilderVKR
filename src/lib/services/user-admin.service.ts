import { prisma } from "@/lib/db";

export class UserAdminService {
  async block(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isBlocked: true },
      select: { id: true, email: true, isBlocked: true },
    });
  }

  async unblock(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isBlocked: false },
      select: { id: true, email: true, isBlocked: true },
    });
  }
}

export const userAdminService = new UserAdminService();
