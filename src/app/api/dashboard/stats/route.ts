
import { getCurrentUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalTasks = await prisma.task.count({
      where: {
        OR: [
          { assignedToId: user.userId },
          { project: { members: { some: { userId: user.userId } } } },
        ],
      },
    });

    const statusCounts = await prisma.task.groupBy({
      by: ["status"],
      where: {
        OR: [
          { assignedToId: user.userId },
          { project: { members: { some: { userId: user.userId } } } },
        ],
      },
      _count: {
        _all: true,
      },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        OR: [
          { assignedToId: user.userId },
          { project: { members: { some: { userId: user.userId } } } },
        ],
        dueDate: { lt: new Date() },
        status: { not: "Done" },
      },
    });

    const tasksPerUser = await prisma.task.groupBy({
      by: ["assignedToId"],
      where: {
        project: { members: { some: { userId: user.userId } } },
      },
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      totalTasks,
      statusCounts: statusCounts.reduce((acc: any, curr) => {
        acc[curr.status] = curr._count._all;
        return acc;
      }, {}),
      overdueTasks,
      tasksPerUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
