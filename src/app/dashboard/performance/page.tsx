import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helper"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartLineUpIcon, UserIcon, ClockIcon } from "@/components/icons"

const PRIORITY_WEIGHTS: Record<string, number> = {
  "High": 3,
  "Medium": 2,
  "Low": 1
}

export default async function PerformancePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect("/login")
  if (!currentUser.isAdmin) redirect("/dashboard")

  const users = await prisma.user.findMany({
    where: {
      id: { not: currentUser.id }
    },
    include: {
      tasks: {
        include: { project: true }
      }
    }
  })

  const performanceData = users.map(user => {
    let totalWeight = 0
    let earnedWeight = 0

    user.tasks.forEach(task => {
      const weight = PRIORITY_WEIGHTS[task.priority] || 1
      totalWeight += weight

      if (task.status === "Done") {
        let timelinessMultiplier = 1.0

        if (task.completedAt && task.dueDate) {
          const completionTime = new Date(task.completedAt).getTime()
          const dueTime = new Date(task.dueDate).getTime()
          
          if (completionTime > dueTime) {
            const hoursLate = (completionTime - dueTime) / (1000 * 60 * 60)
            // Reduce task value by 2% per hour late, but keep at least 0%
            timelinessMultiplier = Math.max(0, 1.0 - (Math.floor(hoursLate) * 0.02))
          }
        }
        
        earnedWeight += weight * timelinessMultiplier
      }
    })

    const finalScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      score: Math.round(finalScore),
      taskCount: user.tasks.length,
      completedTasks: user.tasks.filter(t => t.status === "Done").length
    }
  }).sort((a, b) => b.score - a.score)

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
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Employee Performance</h1>
            <p className="text-muted-foreground">
              Tracking efficiency based on task priority, completion status, and timeliness.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {performanceData.map((user, index) => (
              <Card key={user.id} className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant={user.score > 80 ? "default" : user.score > 50 ? "secondary" : "destructive"}>
                    Rank #{index + 1}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserIcon weight="bold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="text-xs">{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Performance Score</span>
                        <span className="text-4xl font-bold text-primary">{user.score}%</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">Tasks Completed</span>
                        <span className="text-sm font-semibold">{user.completedTasks} / {user.taskCount}</span>
                      </div>
                    </div>
                    
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${user.score}%` }}
                      />
                    </div>

                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        -2% per hour late
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {performanceData.length === 0 && (
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
              No performance data available yet.
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
