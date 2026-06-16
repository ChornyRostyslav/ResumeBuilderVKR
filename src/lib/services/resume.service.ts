import { resumeRepository } from "../repositories/resume.repository";
import crypto from "crypto";

export class ResumeService {
  async togglePublicStatus(id: string, userId: string, makePublic: boolean) {
    let shareId: string | null = null;
    if (makePublic) {
      shareId = crypto.randomUUID();
    }
    
    return resumeRepository.togglePublicStatus(id, userId, makePublic, shareId);
  }

  async getResumeByShareId(shareId: string) {
    return resumeRepository.findByShareId(shareId);
  }

  async getPublicResumes(search: string, category: string, page: number, limit: number = 10) {
    const offset = (page - 1) * limit;
    return resumeRepository.findPublicResumes(search, category, limit, offset);
  }
}

export const resumeService = new ResumeService();
