/**
 * Модульне тестування TemplateService
 * UT-TS-001 – шаблон без prewUrl → ValidationError, публікацію заблоковано
 * UT-TS-002 – коректний шаблон → isPublished = true
 */
jest.mock("@/lib/db", () => ({
  prisma: {
    template: {
      create: jest.fn(),
    },
  },
}));

import { TemplateService, ValidationError } from "@/lib/services/template.service";
import { prisma } from "@/lib/db";

const mockCreate = prisma.template.create as jest.Mock;

describe("UT-TS – TemplateService.publish", () => {
  let service: TemplateService;

  beforeEach(() => {
    service = new TemplateService();
    jest.clearAllMocks();
  });

  // UT-TS-001
  it("UT-TS-001: кидає ValidationError при відсутньому previewUrl", async () => {
    await expect(
      service.publish({ name: "Тестовий шаблон", category: "standard" })
    ).rejects.toThrow(ValidationError);

    await expect(
      service.publish({ name: "Тестовий шаблон", category: "standard" })
    ).rejects.toThrow("Прев'ю-зображення є обов'язковим");
  });

  it("UT-TS-001: кидає ValidationError при previewUrl = null", async () => {
    await expect(
      service.publish({ name: "Шаблон", category: "modern", previewUrl: null })
    ).rejects.toThrow(ValidationError);
  });

  // UT-TS-002
  it("UT-TS-002: публікує шаблон із isPublished = true при коректних даних", async () => {
    const mockTemplate = {
      id: "tpl-001",
      name: "Сучасний",
      category: "modern",
      previewUrl: "https://example.com/preview.png",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCreate.mockResolvedValueOnce(mockTemplate);

    const result = await service.publish({
      name: "Сучасний",
      category: "modern",
      previewUrl: "https://example.com/preview.png",
    });

    expect(result.isPublished).toBe(true);
  });

  it("UT-TS-002: викликає prisma.template.create з isPublished = true", async () => {
    mockCreate.mockResolvedValueOnce({
      id: "tpl-002",
      name: "Елегантний",
      category: "elegant",
      previewUrl: "https://example.com/elegant.png",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.publish({
      name: "Елегантний",
      category: "elegant",
      previewUrl: "https://example.com/elegant.png",
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          isPublished: true,
          previewUrl: "https://example.com/elegant.png",
        }),
      })
    );
  });
});
