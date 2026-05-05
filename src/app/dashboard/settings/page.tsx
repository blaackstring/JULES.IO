"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ShieldCheckIcon, TestTubeIcon, InfoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [testingMode, setTestingMode] = React.useState(true)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setIsAdmin(data.user.isAdmin)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleRoleToggle = async (checked: boolean) => {
    try {
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: checked }),
      })

      if (res.ok) {
        setIsAdmin(checked)
        toast.success(`Role updated to ${checked ? "Admin" : "User"}`)
        // Force refresh to update sidebar
        window.location.reload()
      } else {
        toast.error("Failed to update role")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

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
        <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              {testingMode && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1">
                  <TestTubeIcon className="h-3 w-3" />
                  Testing Purpose
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Manage your account preferences and testing configurations.
            </p>
          </div>

          <Alert className="bg-primary/5 border-primary/20">
            <TestTubeIcon className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">Testing Environment</AlertTitle>
            <AlertDescription>
              This settings page is provided for **testing and evaluation**. You can toggle roles to explore the full capabilities of the platform.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            <Card className="border-primary/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Permissions</CardTitle>
                </div>
                <CardDescription>
                  Switch between user and administrator roles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <Label className="text-base">Administrator Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable admin-only features like the Performance analytics.
                    </p>
                  </div>
                  <Switch
                    checked={isAdmin}
                    onCheckedChange={handleRoleToggle}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TestTubeIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Lab Features</CardTitle>
                </div>
                <CardDescription>
                  Configure environment-specific testing flags.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <Label className="text-base">Testing Mode Indicator</Label>
                    <p className="text-sm text-muted-foreground">
                      Shows a "Testing Purpose" badge across the dashboard.
                    </p>
                  </div>
                  <Switch
                    checked={testingMode}
                    onCheckedChange={setTestingMode}
                  />
                </div>

                <div className="flex items-start gap-3 rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
                  <InfoIcon className="h-4 w-4 mt-0.5" />
                  <p>
                    Testing mode is currently local-only and will reset on page refresh unless persisted.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto py-6 text-center text-xs text-muted-foreground">
            <p>Environment: Testing / Development</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
