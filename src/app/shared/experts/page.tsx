import { resumeService } from "@/lib/services/resume.service";
import { ExpertsSearch } from "@/components/shared/ExpertsSearch";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Каталог фахівців",
  description: "Знайдіть найкращих фахівців у нашій базі.",
};

export default async function ExpertsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const pageParam = searchParams.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;

  const { data: resumes, total } = await resumeService.getPublicResumes(
    search,
    category,
    page || 1,
    10
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад до особистого кабінету
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Каталог фахівців
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          Знайдіть ідеального кандидата для вашого проєкту
        </p>
      </div>

      <ExpertsSearch />

      {resumes.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-white">Нічого не знайдено</h3>
          <p className="mt-2 text-neutral-400">Спробуйте змінити критерії пошуку.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume: any) => (
            <Link
              key={resume.shareId}
              href={`/shared/resume/${resume.shareId}`}
              className="group block rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm transition-all hover:border-blue-500 hover:ring-1 hover:ring-blue-500"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">
                  {resume.firstName} {resume.lastName}
                </h3>
                <p className="font-medium text-blue-400 mt-1">
                  {resume.desiredRole || "Посада не вказана"}
                </p>
              </div>

              {resume.skills && resume.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {resume.skills.slice(0, 5).map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {resume.skills.length > 5 && (
                    <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-neutral-400">
                      +{resume.skills.length - 5}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {total > 10 && (
        <div className="mt-12 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/shared/experts?search=${search}&category=${category}&page=${page - 1}`}
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
            >
              Попередня
            </Link>
          )}
          {page * 10 < total && (
            <Link
              href={`/shared/experts?search=${search}&category=${category}&page=${page + 1}`}
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
            >
              Наступна
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
