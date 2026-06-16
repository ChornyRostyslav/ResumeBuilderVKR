import { prisma } from "@/lib/db";

// The three visual render engines the preview/PDF actually support.
export type TemplateFamily = "standard" | "modern" | "elegant";

const BUILTIN_FAMILIES: TemplateFamily[] = ["standard", "modern", "elegant"];

// Admin templates carry a free-form "category"; map each to a render engine.
const CATEGORY_TO_FAMILY: Record<string, TemplateFamily> = {
  standard: "standard",
  professional: "standard",
  minimal: "standard",
  modern: "modern",
  creative: "modern",
  elegant: "elegant",
};

/**
 * Resolves a stored `resume.template` value into one of the supported render
 * families. The value may be a built-in family name or an admin template id.
 */
export async function resolveTemplateFamily(
  value: string | null | undefined
): Promise<TemplateFamily> {
  if (!value) return "standard";

  if (BUILTIN_FAMILIES.includes(value as TemplateFamily)) {
    return value as TemplateFamily;
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id: value },
      select: { category: true },
    });
    if (template) {
      return CATEGORY_TO_FAMILY[template.category] ?? "standard";
    }
  } catch {
    // Fall through to the default below.
  }

  return "standard";
}
