/**
 * Модульне тестування валідації даних резюме
 * UT-RDS-001 – порожній email → помилка
 * UT-RDS-002 – startDate > endDate → помилка хронології
 */
import { resumeSchema, experienceSchema } from "@/lib/validations/resume";

const VALID_RESUME_BASE = {
  firstName: "Іван",
  contactEmail: "ivan@example.com",
  desiredRole: "Розробник",
  employmentType: "Повна зайнятість",
};

const VALID_EXPERIENCE = {
  company: "ТОВ Тест",
  position: "Розробник",
  startDate: "2020-01-01",
  endDate: "2023-06-01",
  current: false,
};

describe("UT-RDS – ResumeDataService.validate", () => {
  // UT-RDS-001
  describe("UT-RDS-001: порожній email", () => {
    it("повертає помилку 'Email обов'язковий' при contactEmail = ''", () => {
      const result = resumeSchema.safeParse({
        ...VALID_RESUME_BASE,
        contactEmail: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailIssue = result.error.issues.find((i) =>
          i.path.includes("contactEmail")
        );
        expect(emailIssue).toBeDefined();
        expect(emailIssue?.message).toMatch(/Email обов'язковий/);
      }
    });

    it("повертає помилку при відсутньому полі contactEmail", () => {
      const { contactEmail: _omit, ...withoutEmail } = VALID_RESUME_BASE;
      const result = resumeSchema.safeParse(withoutEmail);

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailIssue = result.error.issues.find((i) =>
          i.path.includes("contactEmail")
        );
        expect(emailIssue).toBeDefined();
      }
    });
  });

  // UT-RDS-002
  describe("UT-RDS-002: startDate > endDate", () => {
    it("повертає помилку хронології коли startDate пізніше endDate", () => {
      const result = experienceSchema.safeParse({
        company: "ТОВ Тест",
        position: "Розробник",
        startDate: "2023-06-01",
        endDate: "2022-01-01",
        current: false,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const chronoIssue = result.error.issues.find((i) =>
          i.message.includes("Дата початку не може бути пізніше")
        );
        expect(chronoIssue).toBeDefined();
      }
    });

    it("повертає помилку коли startDate та endDate однакові, але порядок все одно валідний", () => {
      const result = experienceSchema.safeParse({
        ...VALID_EXPERIENCE,
        startDate: "2022-01-01",
        endDate: "2022-01-01",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Позитивні сценарії", () => {
    it("приймає коректні дані резюме", () => {
      const result = resumeSchema.safeParse(VALID_RESUME_BASE);
      expect(result.success).toBe(true);
    });

    it("приймає досвід з хронологічно вірними датами", () => {
      const result = experienceSchema.safeParse(VALID_EXPERIENCE);
      expect(result.success).toBe(true);
    });

    it("приймає досвід де current = true без endDate", () => {
      const result = experienceSchema.safeParse({
        company: "ТОВ Тест",
        position: "Розробник",
        startDate: "2022-01-01",
        current: true,
      });
      expect(result.success).toBe(true);
    });
  });
});
