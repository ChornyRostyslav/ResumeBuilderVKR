import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import PrintButton from "@/components/resume-builder/PrintButton";

export default async function PreviewResumePage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="min-h-screen bg-neutral-950 print:bg-white text-neutral-300 print:text-black">
      {/* Floating Action Bar - Hidden during print */}
      <div className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8 print:hidden shadow-sm">
        <div className="mx-auto max-w-[210mm] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Панель керування</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/resume/${resume.id}/edit`}
              className="inline-flex items-center rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors shadow-sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Редагувати резюме
            </Link>
            
            <PrintButton />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0">
        <ResumePreview resume={resume} />
      </main>
    </div>
  );
}
