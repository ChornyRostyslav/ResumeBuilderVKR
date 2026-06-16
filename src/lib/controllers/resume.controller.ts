import { resumeService } from "../services/resume.service";
import { NextResponse } from "next/server";

export class ResumeController {
  async togglePublic(req: Request, id: string, userId: string) {
    try {
      const json = await req.json();
      const { isPublic } = json;

      if (typeof isPublic !== 'boolean') {
        return NextResponse.json({ message: "Invalid payload, 'isPublic' boolean is required" }, { status: 400 });
      }

      const updatedResume = await resumeService.togglePublicStatus(id, userId, isPublic);

      return NextResponse.json(updatedResume);
    } catch (error) {
      console.error("Error toggling public status:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }

  async getPublicResumes(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search") || "";
      const category = searchParams.get("category") || "";
      const pageParam = searchParams.get("page");
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const limit = 10;

      if (isNaN(page) || page < 1) {
        return NextResponse.json({ message: "Invalid page parameter" }, { status: 400 });
      }

      const result = await resumeService.getPublicResumes(search, category, page, limit);

      return NextResponse.json({
        data: result.data,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        }
      });
    } catch (error) {
      console.error("Error fetching public resumes:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }

  async getResumeByShareId(shareId: string) {
    try {
      const resume = await resumeService.getResumeByShareId(shareId);

      if (!resume) {
        return NextResponse.json({ message: "Resume not found or not public" }, { status: 404 });
      }

      return NextResponse.json(resume);
    } catch (error) {
      console.error("Error fetching resume by shareId:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }
}

export const resumeController = new ResumeController();
