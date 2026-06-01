import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function NewResumePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Auto-create a draft resume and redirect to edit
  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: "Нове резюме",
    },
  });

  redirect(`/resume/${resume.id}/edit`);
}
