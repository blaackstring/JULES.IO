import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helper";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { status, title, description, dueDate, priority, assignedToId } = await req.json();

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { include: { members: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if user is member of project or assigned to task
    const isMember = task.project.members.some((m) => m.userId === user.userId);
    const isAssigned = task.assignedToId === user.userId;

    if (!isMember && !isAssigned) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        assignedToId,
        completedAt: status === "Done" ? new Date() : null,
      },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { include: { members: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Only Admin of project or creator of task can delete
    const admin = task.project.members.find(
      (m) => m.userId === user.userId && m.role === "ADMIN"
    );
    const isCreator = task.createdById === user.userId;

    if (!admin && !isCreator) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
