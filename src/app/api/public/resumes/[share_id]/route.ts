import { resumeController } from "@/lib/controllers/resume.controller";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ share_id: string }> }
) {
  const { share_id } = await params;
  return resumeController.getResumeByShareId(share_id);
}
