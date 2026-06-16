import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateResumePdf } from "@/lib/pdf";

// Puppeteer needs the Node.js runtime, and Chromium cold starts can be slow.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!resume) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  // Build the absolute URL of the resume's preview page for Puppeteer to render.
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("host") ?? "localhost:3000";
  const baseUrl = process.env.NEXTAUTH_URL ?? `${proto}://${host}`;
  const targetUrl = `${baseUrl}/resume/${id}/preview`;

  // Forward the caller's session cookie so the protected preview page renders.
  const cookieHeader = req.headers.get("cookie") ?? undefined;

  try {
    const pdfBuffer = await generateResumePdf(targetUrl, cookieHeader);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    // Surface the real cause to the client temporarily for debugging.
    const detail =
      error instanceof Error
        ? `${error.message}\n${error.stack ?? ""}`
        : String(error);
    return NextResponse.json(
      { message: "PDF generation failed", detail },
      { status: 500 }
    );
  }
}
