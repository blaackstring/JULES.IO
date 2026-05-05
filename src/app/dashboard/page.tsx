import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helper"
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table"
import { CreateTaskDialog } from "@/components/create-task-dialog"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Parallel data fetching on the server
  const [stats, tasks] = await Promise.all([
    // Get Stats
    (async () => {
      const totalTasks = await prisma.task.count({
        where: {
          OR: [
            { assignedToId: user.userId },
            { project: { members: { some: { userId: user.userId } } } },
          ],
        },
      })

      const completedTasks = await prisma.task.count({
        where: {
          status: "Done",
          OR: [
            { assignedToId: user.userId },
            { project: { members: { some: { userId: user.userId } } } },
          ],
        },
      })

      const inProgressTasks = await prisma.task.count({
        where: {
          status: "In Progress",
          OR: [
            { assignedToId: user.userId },
            { project: { members: { some: { userId: user.userId } } } },
          ],
        },
      })

      const pendingTasks = totalTasks - completedTasks

      const overdueTasks = await prisma.task.count({
        where: {
          status: { not: "Done" },
          dueDate: { lt: new Date() },
          OR: [
            { assignedToId: user.userId },
            { project: { members: { some: { userId: user.userId } } } },
          ],
        },
      })

      return { totalTasks, completedTasks, inProgressTasks, pendingTasks, overdueTasks }
    })(),

    // Get Tasks
    prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: user.userId },
          { project: { members: { some: { userId: user.userId } } } },
        ],
      },
      include: {
        project: true,
        assignedTo: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const tableData = tasks.map((task) => ({
    id: task.id,
    header: task.title,
    type: task.project?.name || "No Project",
    status: task.status,
    target: task.priority,
    limit: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date",
    reviewer: task.assignedTo?.name || "Unassigned",
  }))

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">All Assigned Tasks</h2>
                  <CreateTaskDialog />
                </div>
                <DataTable data={tableData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
