import { resumeController } from "@/lib/controllers/resume.controller";

export async function GET(req: Request) {
  return resumeController.getPublicResumes(req);
}
