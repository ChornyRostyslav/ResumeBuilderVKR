import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { PlusCircle, FileText, Users, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { DeleteResumeButton } from "@/components/dashboard/DeleteResumeButton";
import { PublicToggle } from "@/components/dashboard/PublicToggle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Clean up completely empty drafts that were abandoned
  await prisma.resume.deleteMany({
    where: {
      userId: session.user.id,
      title: "Нове резюме",
      firstName: null,
      lastName: null,
    },
  });

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <h3 className="text-2xl font-semibold leading-6 text-white">
          Особистий кабінет
        </h3>
        <div className="mt-3 sm:ml-4 sm:mt-0 flex gap-3">
          <SettingsModal />
          <LogoutButton />
          {session.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
            >
              <ShieldCheck className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Адмін-панель
            </Link>
          )}
          <Link
            href="/shared/experts"
            className="inline-flex items-center rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
          >
            <Users className="-ml-0.5 mr-1.5 h-5 w-5 text-blue-500" aria-hidden="true" />
            Каталог фахівців
          </Link>
          <Link
            href="/resume/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusCircle className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Створити резюме
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {resumes.length === 0 ? (
          <div className="text-center mt-16">
            <FileText className="mx-auto h-12 w-12 text-neutral-500" />
            <h3 className="mt-2 text-sm font-semibold text-white">Немає резюме</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Почніть зі створення нового резюме.
            </p>
            <div className="mt-6">
              <Link
                href="/resume/new"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                <PlusCircle className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Нове резюме
              </Link>
            </div>
          </div>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="col-span-1 divide-y divide-neutral-800 rounded-lg bg-neutral-900 ring-1 ring-neutral-800 shadow transition hover:ring-blue-500"
              >
                <div className="flex w-full flex-col p-6">
                  <div className="flex w-full items-center justify-between space-x-6">
                    <div className="flex-1 truncate">
                      <h3 className="truncate text-lg font-medium text-white hover:text-blue-500">
                        {resume.title}
                      </h3>
                      <p className="mt-1 truncate text-sm text-neutral-400">
                        {resume.desiredRole || "Посада не вказана"}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Останнє оновлення: {resume.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/resume/${resume.id}/preview`}
                      className="inline-flex flex-[2] justify-center items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20 transition-colors"
                    >
                      Переглянути PDF
                    </Link>
                    <Link
                      href={`/resume/${resume.id}/edit`}
                      className="inline-flex flex-[2] justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                    >
                      Редагувати
                    </Link>
                    <DeleteResumeButton resumeId={resume.id} />
                  </div>
                  <PublicToggle 
                    resumeId={resume.id} 
                    initialIsPublic={resume.isPublic} 
                    initialShareId={resume.shareId} 
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
