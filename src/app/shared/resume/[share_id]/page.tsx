import { resumeService } from "@/lib/services/resume.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import PrintButton from "@/components/resume-builder/PrintButton";

export const metadata = {
  title: "Публічне резюме",
};

export default async function PublicResumePage({ params }: { params: Promise<{ share_id: string }> }) {
  const { share_id } = await params;
  
  const resume = await resumeService.getResumeByShareId(share_id);

  if (!resume) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 print:bg-white text-neutral-300 print:text-black">
      {/* Floating Action Bar - Hidden during print */}
      <div className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8 print:hidden shadow-sm">
        <div className="mx-auto max-w-[210mm] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/shared/experts"
              className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">До каталогу</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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
