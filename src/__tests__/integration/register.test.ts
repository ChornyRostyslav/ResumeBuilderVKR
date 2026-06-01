/**
 * Інтеграційне тестування реєстрації
 * IT-01 – POST /api/register (новий email) → 201 Created, пароль хешовано
 * IT-02 – POST /api/register (дублікат email) → 409 Conflict
 */
jest.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("$2b$10$hashed_password_mock"),
  compare: jest.fn().mockResolvedValue(true),
}));

import { POST } from "@/app/api/register/route";
import { prisma } from "@/lib/db";

const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;

const makeRequest = (body: object) =>
  new Request("http://localhost/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("IT – POST /api/register", () => {
  beforeEach(() => jest.clearAllMocks());

  // IT-01
  it("IT-01: реєструє нового користувача → 201 Created, пароль збережено як хеш", async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({
      id: "new-user-id",
      email: "newuser@test.com",
    });

    const res = await POST(makeRequest({ email: "newuser@test.com", password: "SecurePass1!" }));

    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.user.email).toBe("newuser@test.com");

    // Пароль збережено як хеш, а не відкритим текстом
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "newuser@test.com",
          password: "$2b$10$hashed_password_mock",
        }),
      })
    );
  });

  // IT-02
  it("IT-02: повертає 409 Conflict при дублікаті email", async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: "existing-id",
      email: "existing@test.com",
    });

    const res = await POST(makeRequest({ email: "existing@test.com", password: "pass123" }));

    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.message).toMatch(/already exists/i);
  });

  it("повертає 400 при відсутньому email або паролі", async () => {
    const res = await POST(makeRequest({ email: "only@email.com" }));
    expect(res.status).toBe(400);
  });
});
