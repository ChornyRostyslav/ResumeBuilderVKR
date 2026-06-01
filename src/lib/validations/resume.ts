import * as z from "zod";

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Компанія обов'язкова"),
  position: z.string().min(1, "Посада обов'язкова"),
  startDate: z.string().min(1, "Дата початку обов'язкова"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().max(300, "Опис не може перевищувати 300 символів").optional(),
}).superRefine((data, ctx) => {
  if (data.startDate) {
    const year = parseInt(data.startDate.split('-')[0], 10);
    if (isNaN(year) || year < 1980 || year > 2025) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Рік повинен бути між 1980 і 2025",
        path: ["startDate"],
      });
    }
  }
  
  if (!data.current && (!data.endDate || data.endDate.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Дата закінчення обов'язкова",
      path: ["endDate"],
    });
  } else if (data.endDate && data.endDate.trim() !== "") {
    const year = parseInt(data.endDate.split('-')[0], 10);
    if (isNaN(year) || year < 1980 || year > 2025) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Рік повинен бути між 1980 і 2025",
        path: ["endDate"],
      });
    }

    if (data.startDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start > end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Дата початку не може бути пізніше за дату закінчення",
          path: ["startDate"],
        });
      }
    }
  }
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Навчальний заклад обов'язковий"),
  degree: z.string().min(1, "Ступінь обов'язковий"),
  fieldOfStudy: z.string().min(1, "Спеціальність обов'язкова"),
  gradYear: z.string().min(1, "Рік випуску обов'язковий"),
});

export const languageSchema = z.object({
  name: z.string().min(1, "Мова обов'язкова"),
  level: z.string().min(1, "Рівень обов'язковий"),
});

export const resumeSchema = z.object({
  title: z.string().min(1, "Назва резюме обов'язкова").default("Моє резюме"),
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().optional(),
  contactEmail: z.string().min(1, "Email обов'язковий").email("Невірний формат email"),
  phone: z.string().max(20, "Номер телефону не може перевищувати 20 символів").regex(/^[\d\s\+\-\(\)]*$/, "В номері телефону не можуть бути букви").optional().or(z.literal("")),
  location: z.string().optional(),
  desiredRole: z.string().min(1, "Бажана посада обов'язкова"),
  employmentType: z.string().min(1, "Зайнятість обов'язкова"),
  salary: z.string().optional(),
  about: z.string().max(300, "Про мене не може перевищувати 300 символів").optional(),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema.superRefine((data, ctx) => {
    if (data.gradYear) {
      const year = parseInt(data.gradYear, 10);
      if (isNaN(year) || year < 1970 || year > 2025) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Рік повинен бути між 1970 і 2025",
          path: ["gradYear"],
        });
      }
    }
  })).default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(languageSchema).default([]),
  template: z.enum(["standard", "modern", "elegant"]).default("standard"),
});

export type ResumeValues = z.infer<typeof resumeSchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type LanguageValues = z.infer<typeof languageSchema>;
