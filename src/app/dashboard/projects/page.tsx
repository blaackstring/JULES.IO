import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helper"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BriefcaseIcon, UsersIcon, CheckCircleIcon, PlusIcon } from "@/components/icons"

export default async function ProjectsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const projects = await prisma.project.findMany({
    where: {
      members: { some: { userId: user.userId } },
    },
    include: {
      members: { include: { user: true } },
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const tableData = projects.map((project) => ({
    id: project.id,
    header: project.name,
    type: project.description || "No description",
    status: project.members?.length + " Members",
    target: project.tasks?.length + " Tasks",
    limit: new Date(project.createdAt).toLocaleDateString(),
    reviewer: "Admin",
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
                  <h1 className="text-3xl font-bold">Project Management</h1>
                  <p className="text-muted-foreground">Oversee and manage all active projects.</p>
                </div>
                <CreateProjectDialog
                  trigger={
                    <Button className="gap-2">
                      <PlusIcon className="size-4" />
                      New Project
                    </Button>
                  }
                />
              </div>

              <div className="px-4 lg:px-6 grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projects.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Collaborators</CardTitle>
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {projects.reduce((acc, p) => acc + (p.members?.length || 0), 0)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                    <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {projects.reduce((acc, p) => acc + (p.tasks?.filter((t: any) => t.status === "Done").length || 0), 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6 mt-4">
                <DataTable data={tableData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
