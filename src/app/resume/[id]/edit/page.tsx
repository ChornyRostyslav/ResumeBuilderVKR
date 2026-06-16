import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ResumeForm from "@/components/resume-builder/ResumeForm";

export default async function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: {
      id,
      user: {
        email: session.user.email,
      },
    },
  });

  if (!resume) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад до панелі керування
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-8">
          Редагування <span className="text-blue-500">{resume.title}</span>
        </h1>
        
        <ResumeForm initialData={resume} />
      </div>
    </div>
  );
}
