import { adminGuard } from "@/lib/adminGuard";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TemplatesClient } from "@/components/admin/TemplatesClient";

export default async function AdminTemplatesPage() {
  const guard = await adminGuard();
  if (guard) redirect("/login");

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Шаблони резюме</h1>
      <TemplatesClient initialTemplates={templates} />
    </div>
  );
}
