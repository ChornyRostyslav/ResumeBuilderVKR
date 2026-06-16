/**
 * Модульне тестування UserAdminService
 * UT-UA-001 – block(userId) → isBlocked = true
 */
jest.mock("@/lib/db", () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));

import { UserAdminService } from "@/lib/services/user-admin.service";
import { prisma } from "@/lib/db";

const mockUpdate = prisma.user.update as jest.Mock;

describe("UT-UA – UserAdminService.block", () => {
  let service: UserAdminService;

  beforeEach(() => {
    service = new UserAdminService();
    jest.clearAllMocks();
  });

  // UT-UA-001
  it("UT-UA-001: встановлює isBlocked = true для активного користувача", async () => {
    const mockUser = { id: "user-123", email: "user@test.com", isBlocked: true };
    mockUpdate.mockResolvedValueOnce(mockUser);

    const result = await service.block("user-123");

    expect(result.isBlocked).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: { isBlocked: true },
      select: { id: true, email: true, isBlocked: true },
    });
  });

  it("повертає об'єкт з правильним id та email після блокування", async () => {
    mockUpdate.mockResolvedValueOnce({
      id: "user-456",
      email: "target@test.com",
      isBlocked: true,
    });

    const result = await service.block("user-456");

    expect(result.id).toBe("user-456");
    expect(result.email).toBe("target@test.com");
  });

  it("unblock встановлює isBlocked = false", async () => {
    mockUpdate.mockResolvedValueOnce({
      id: "user-123",
      email: "user@test.com",
      isBlocked: false,
    });

    const result = await service.unblock("user-123");

    expect(result.isBlocked).toBe(false);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: { isBlocked: false },
      select: { id: true, email: true, isBlocked: true },
    });
  });
});
