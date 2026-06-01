/**
 * Інтеграційне тестування резюме
 * IT-03 – PUT /api/resumes/{id} → 200 OK, інші секції JSON не втрачено
 * IT-04 – POST /api/resumes/{id}/export → 200 OK, Content-Type: application/pdf
 */
jest.mock("@/lib/db", () => ({
  prisma: {
    resume: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({ authOptions: {} }));

jest.mock("@/lib/pdf", () => ({
  generateResumePdf: jest
    .fn()
    .mockResolvedValue(Buffer.from("%PDF-1.4 1 0 obj test")),
}));

import { PUT } from "@/app/api/resumes/[id]/route";
import { POST as exportPost } from "@/app/api/resumes/[id]/export/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

const mockSession = getServerSession as jest.Mock;
const mockFindUnique = prisma.resume.findUnique as jest.Mock;
const mockUpdate = prisma.resume.update as jest.Mock;

const USER_SESSION = {
  user: { id: "user-001", email: "user@test.com", role: "USER", name: "Test" },
  expires: "9999-01-01",
};

const RESUME_DATA = {
  title: "Моє резюме",
  firstName: "Іван",
  lastName: "Тест",
  contactEmail: "ivan@test.com",
  desiredRole: "Розробник",
  employmentType: "Повна зайнятість",
  experience: [
    {
      company: "ТОВ Тест",
      position: "Розробник",
      startDate: "2020-01-01",
      endDate: "2023-01-01",
      current: false,
    },
  ],
  education: [],
  skills: ["TypeScript", "React"],
  languages: [],
  template: "standard" as const,
};

describe("IT – Resumes API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSession.mockResolvedValue(USER_SESSION);
  });

  // IT-03
  describe("IT-03: PUT /api/resumes/{id} – часткове оновлення", () => {
    it("повертає 200 OK і зберігає всі секції JSON (skills, experience тощо)", async () => {
      // Перша findUnique — перевірка власника
      mockFindUnique.mockResolvedValueOnce({ userId: "user-001" });
      mockUpdate.mockResolvedValueOnce({
        id: "resume-001",
        userId: "user-001",
        ...RESUME_DATA,
        title: "Оновлена назва",
        updatedAt: new Date(),
      });

      const req = new Request("http://localhost/api/resumes/resume-001", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...RESUME_DATA, title: "Оновлена назва" }),
      });

      const res = await PUT(req, {
        params: Promise.resolve({ id: "resume-001" }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.title).toBe("Оновлена назва");

      // skills (JSONB) не втрачено
      expect(data.skills).toContain("TypeScript");
      expect(data.skills).toContain("React");
    });

    it("повертає 403 якщо resume належить іншому користувачеві", async () => {
      mockFindUnique.mockResolvedValueOnce({ userId: "other-user" });

      const req = new Request("http://localhost/api/resumes/resume-999", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(RESUME_DATA),
      });

      const res = await PUT(req, {
        params: Promise.resolve({ id: "resume-999" }),
      });

      expect(res.status).toBe(403);
    });
  });

  // IT-04
  describe("IT-04: POST /api/resumes/{id}/export – генерація PDF", () => {
    it("повертає 200 OK з Content-Type: application/pdf", async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: "resume-001",
        userId: "user-001",
        ...RESUME_DATA,
      });

      const req = new Request(
        "http://localhost/api/resumes/resume-001/export",
        { method: "POST" }
      );

      const res = await exportPost(req, {
        params: Promise.resolve({ id: "resume-001" }),
      });

      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
    });

    it("повертає 404 якщо резюме не знайдено", async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      const req = new Request(
        "http://localhost/api/resumes/nonexistent/export",
        { method: "POST" }
      );

      const res = await exportPost(req, {
        params: Promise.resolve({ id: "nonexistent" }),
      });

      expect(res.status).toBe(404);
    });
  });
});
