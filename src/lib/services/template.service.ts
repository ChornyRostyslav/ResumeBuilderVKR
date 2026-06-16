import { prisma } from "@/lib/db";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface TemplateDto {
  name: string;
  category: string;
  previewUrl?: string | null;
  isPublished?: boolean;
}

export class TemplateService {
  async publish(dto: TemplateDto) {
    if (!dto.previewUrl) {
      throw new ValidationError("Прев'ю-зображення є обов'язковим");
    }

    return prisma.template.create({
      data: {
        name: dto.name,
        category: dto.category,
        previewUrl: dto.previewUrl,
        isPublished: true,
      },
    });
  }
}

export const templateService = new TemplateService();
