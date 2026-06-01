import { adminGuard } from "@/lib/adminGuard";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Users, FileText, LayoutTemplate, UserX, TrendingUp, CalendarDays } from "lucide-react";

async function getStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersLast30Days,
    totalResumes,
    totalTemplates,
    publishedTemplates,
    blockedUsers,
    templateUsage,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.resume.count(),
    prisma.template.count(),
    prisma.template.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { isBlocked: true } }),
    prisma.resume.groupBy({
      by: ["template"],
      _count: { template: true },
      orderBy: { _count: { template: "desc" } },
      take: 5,
    }),
  ]);

  return {
    totalUsers,
    newUsersLast30Days,
    totalResumes,
    totalTemplates,
    publishedTemplates,
    blockedUsers,
    templateUsage,
  };
}

export default async function AdminDashboardPage() {
  const guard = await adminGuard();
  if (guard) redirect("/login");

  const stats = await getStats();

  const cards = [
    {
      label: "Всього користувачів",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Нових за 30 днів",
      value: stats.newUsersLast30Days,
      icon: CalendarDays,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Резюме",
      value: stats.totalResumes,
      icon: FileText,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Шаблони (опубл.)",
      value: `${stats.publishedTemplates} / ${stats.totalTemplates}`,
      icon: LayoutTemplate,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Заблоковані",
      value: stats.blockedUsers,
      icon: UserX,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Дашборд</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl bg-neutral-900 border border-neutral-800 p-5 flex items-center gap-4"
          >
            <div className={`rounded-lg p-2.5 ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Популярність шаблонів</h2>
        </div>
        {stats.templateUsage.length === 0 ? (
          <p className="text-neutral-400 text-sm">Дані відсутні</p>
        ) : (
          <div className="space-y-3">
            {stats.templateUsage.map((t) => {
              const pct = stats.totalResumes
                ? Math.round((t._count.template / stats.totalResumes) * 100)
                : 0;
              return (
                <div key={t.template}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-300 capitalize">{t.template}</span>
                    <span className="text-neutral-400">
                      {t._count.template} резюме ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-800">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
