/**
 * Модульне тестування авторизаційного захисту
 * UT-AU-001 – валідна сесія ADMIN → доступ дозволено (null)
 * UT-AU-002 – відсутня / прострочена сесія → 401 Unauthorized
 */
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

import { adminGuard } from "@/lib/adminGuard";
import { getServerSession } from "next-auth/next";

const mockSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe("UT-AU – adminGuard (перевірка JWT / сесії)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // UT-AU-001
  it("UT-AU-001: повертає null для авторизованого адміністратора (ADMIN)", async () => {
    mockSession.mockResolvedValueOnce({
      user: { id: "admin-id", email: "admin@test.com", role: "ADMIN", name: "Admin" },
      expires: "9999-01-01",
    } as never);

    const result = await adminGuard();

    expect(result).toBeNull();
  });

  // UT-AU-002
  it("UT-AU-002: повертає 401 при відсутній/простроченій сесії", async () => {
    mockSession.mockResolvedValueOnce(null as never);

    const result = await adminGuard();

    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);
  });

  it("повертає 403 Forbidden для користувача з роллю USER", async () => {
    mockSession.mockResolvedValueOnce({
      user: { id: "user-id", email: "user@test.com", role: "USER", name: "User" },
      expires: "9999-01-01",
    } as never);

    const result = await adminGuard();

    expect(result).not.toBeNull();
    expect(result?.status).toBe(403);
  });
});
