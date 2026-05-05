import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helper"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { Badge } from "@/components/ui/badge"
import { AddMemberDialog } from "@/components/add-member-dialog"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const [project, tasks] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: true }
        }
      }
    }),
    prisma.task.findMany({
      where: { projectId: id },
      include: {
        project: true,
        assignedTo: true
      },
      orderBy: { createdAt: "desc" }
    })
  ])

  if (!project) {
    redirect("/dashboard")
  }

  const isAdmin = project.members.find((m: any) => m.userId === user.userId)?.role === "ADMIN"

  const tableData = tasks.map((task) => ({
    id: task.id,
    header: task.title,
    type: task.project?.name || "No Project",
    status: task.status,
    target: task.priority,
    limit: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date",
    reviewer: task.assignedTo?.name || "Unassigned"
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
              <div className="px-4 lg:px-6 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">{project.name}</h1>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && <AddMemberDialog projectId={id} />}
                  <CreateTaskDialog projectId={id} />
                </div>
              </div>
              
              <div className="px-4 lg:px-6">
                <div className="flex gap-4 mb-6">
                  <div className="bg-card p-4 rounded-lg border flex-1">
                    <p className="text-sm text-muted-foreground">Members</p>
                    <div className="flex -space-x-2 mt-2">
                      {project.members.map((member: any) => (
                        <Badge key={member.id} variant="outline" className="bg-background">
                          {member.user.name} ({member.role})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-4">Project Tasks</h2>
                <DataTable data={tableData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
