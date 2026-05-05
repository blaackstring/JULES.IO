"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { NavUser } from "@/components/nav-user"
import { BriefcaseIcon, ChartLineUpIcon, GearIcon, LayoutIcon, PlusIcon } from "@/components/icons"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [projects, setProjects] = React.useState<any[]>([])
  const [user, setUser] = React.useState<any>(null)
  const router = useRouter()

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, userRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/auth/me")
        ])

        if (projectsRes.ok) {
          const data = await projectsRes.json()
          setProjects(data.projects)
        }

        if (userRes.ok) {
          const data = await userRes.json()
          setUser(data.user)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
      }
    }

    fetchData()
  }, [router])

  const versions = ["1.0.0", "1.1.0", "2.0.0"]

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={versions}
          defaultVersion={versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <LayoutIcon />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/projects">
                    <BriefcaseIcon />
                    <span>Projects</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user?.isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/performance">
                      <ChartLineUpIcon />
                      <span>Performance</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/settings">
                    <GearIcon />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <CreateTaskDialog 
                  trigger={
                    <SidebarMenuButton>
                      <PlusIcon />
                      <span>New Task</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-2">
              <CreateProjectDialog />
            </div>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild>
                    <a href={`/dashboard/projects/${project.id}`}>
                      <BriefcaseIcon />
                      <span>{project.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={{ name: user.name, email: user.email, avatar: "" }} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
