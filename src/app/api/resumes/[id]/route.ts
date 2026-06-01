import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resumeSchema } from "@/lib/validations/resume";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const resume = await prisma.resume.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    // Convert string array to objects if necessary, or pass JSON safely
    return NextResponse.json(resume);
  } catch (error) {
    console.error("Failed to fetch resume:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const json = await req.json();

    // Validate incoming data
    const body = resumeSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: body.error.issues },
        { status: 400 }
      );
    }

    const data = body.data;

    // Check if resume exists and belongs to user
    const existingResume = await prisma.resume.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!existingResume) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    if (existingResume.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedResume = await prisma.resume.update({
      where: { id },
      data: {
        title: data.title,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        location: data.location || null,
        desiredRole: data.desiredRole || null,
        employmentType: data.employmentType || null,
        salary: data.salary || null,
        about: data.about || null,
        experience: data.experience ? JSON.parse(JSON.stringify(data.experience)) : [],
        education: data.education ? JSON.parse(JSON.stringify(data.education)) : [],
        skills: data.skills || [],
        languages: data.languages ? JSON.parse(JSON.stringify(data.languages)) : [],
        template: data.template || "standard",
      },
    });

    return NextResponse.json(updatedResume);
  } catch (error) {
    console.error("Failed to update resume:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingResume = await prisma.resume.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!existingResume) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    if (existingResume.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Failed to delete resume:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
