// Server-side PDF generation stub.
// The primary PDF export uses html2canvas + jspdf on the client side.
// This module exists to allow the /api/resumes/[id]/export route to be tested.
export async function generateResumePdf(_resume: unknown): Promise<Buffer> {
  throw new Error("Server-side PDF generation requires a Puppeteer setup");
}
