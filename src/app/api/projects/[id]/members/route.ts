import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helper";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;

  try {
    const { email, role } = await req.json();

    // Check if current user is ADMIN of this project
    const adminMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.userId,
          projectId,
        },
      },
    });

    if (!adminMember || adminMember.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can add members" },
        { status: 403 }
      );
    }

    // Find user to add
    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const member = await prisma.projectMember.create({
      data: {
        userId: userToAdd.id,
        projectId,
        role: role || "MEMBER",
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
