/**
 * Інтеграційне тестування адміністративних ендпоінтів
 * IT-05 – POST /admin/templates (роль ADMIN) → 201 Created
 * IT-06 – POST /admin/templates (роль USER)  → 403 Forbidden
 * IT-07 – PATCH /admin/users/{id}/block      → 200 OK, isBlocked = true
 */
jest.mock("@/lib/db", () => ({
  prisma: {
    template: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({ authOptions: {} }));

import { POST as createTemplate } from "@/app/api/admin/templates/route";
import { PATCH as blockUser } from "@/app/api/admin/users/[id]/block/route";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";

const mockSession = getServerSession as jest.Mock;
const mockTemplateCreate = prisma.template.create as jest.Mock;
const mockUserFindUnique = prisma.user.findUnique as jest.Mock;
const mockUserUpdate = prisma.user.update as jest.Mock;

const ADMIN_SESSION = {
  user: { id: "admin-001", email: "admin@test.com", role: "ADMIN", name: "Admin" },
  expires: "9999-01-01",
};

const USER_SESSION = {
  user: { id: "user-001", email: "user@test.com", role: "USER", name: "User" },
  expires: "9999-01-01",
};

const makeTemplateReq = (body: object) =>
  new Request("http://localhost/api/admin/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("IT – Admin API", () => {
  beforeEach(() => jest.clearAllMocks());

  // IT-05
  it("IT-05: адміністратор додає шаблон → 201 Created", async () => {
    mockSession.mockResolvedValue(ADMIN_SESSION);
    mockTemplateCreate.mockResolvedValueOnce({
      id: "tpl-001",
      name: "Класичний",
      category: "standard",
      previewUrl: null,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await createTemplate(makeTemplateReq({ name: "Класичний", category: "standard" }));

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Класичний");
  });

  // IT-06
  it("IT-06: звичайний USER отримує 403 Forbidden при спробі додати шаблон", async () => {
    mockSession.mockResolvedValue(USER_SESSION);

    const res = await createTemplate(
      makeTemplateReq({ name: "Класичний", category: "standard" })
    );

    expect(res.status).toBe(403);
  });

  it("IT-06: неавторизований запит отримує 401", async () => {
    mockSession.mockResolvedValue(null);

    const res = await createTemplate(
      makeTemplateReq({ name: "Класичний", category: "standard" })
    );

    expect(res.status).toBe(401);
  });

  // IT-07
  it("IT-07: адміністратор блокує користувача → 200 OK, isBlocked = true", async () => {
    mockSession.mockResolvedValue(ADMIN_SESSION);
    mockUserFindUnique.mockResolvedValueOnce({
      id: "victim-user",
      email: "victim@test.com",
      isBlocked: false,
    });
    mockUserUpdate.mockResolvedValueOnce({
      id: "victim-user",
      email: "victim@test.com",
      isBlocked: true,
    });

    const req = new Request(
      "http://localhost/api/admin/users/victim-user/block",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: true }),
      }
    );

    const res = await blockUser(req, {
      params: Promise.resolve({ id: "victim-user" }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isBlocked).toBe(true);
  });

  it("IT-07: повертає 400 при спробі адміна заблокувати самого себе", async () => {
    // findUnique не викликається — route повертається до неї (перевірка id === session.user.id)
    mockSession.mockResolvedValue(ADMIN_SESSION);

    const req = new Request(
      "http://localhost/api/admin/users/admin-001/block",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: true }),
      }
    );

    const res = await blockUser(req, {
      params: Promise.resolve({ id: "admin-001" }),
    });

    expect(res.status).toBe(400);
  });

  it("IT-07: повертає 404 якщо користувач не знайдений", async () => {
    mockSession.mockResolvedValue(ADMIN_SESSION);
    mockUserFindUnique.mockResolvedValueOnce(null);

    const req = new Request(
      "http://localhost/api/admin/users/nonexistent/block",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: true }),
      }
    );

    const res = await blockUser(req, {
      params: Promise.resolve({ id: "nonexistent" }),
    });

    expect(res.status).toBe(404);
  });
});
