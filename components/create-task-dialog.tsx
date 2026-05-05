"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { PlusIcon } from "@phosphor-icons/react"

export function CreateTaskDialog({ 
  projectId: initialProjectId,
  trigger
}: { 
  projectId?: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [projectId, setProjectId] = useState(initialProjectId || "")
  const router = useRouter()

  useEffect(() => {
    if (open) {
      // Fetch users
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data.users || []))
      
      // Fetch projects if not provided
      if (!initialProjectId) {
        fetch("/api/projects")
          .then((res) => res.json())
          .then((data) => setProjects(data.projects || []))
      }
    }
  }, [open, initialProjectId])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title")
    const description = formData.get("description")
    const dueDate = formData.get("dueDate")
    const priority = formData.get("priority")
    const assignedToId = formData.get("assignedToId")
    const finalProjectId = initialProjectId || formData.get("projectId")

    if (!finalProjectId) {
      toast.error("Please select a project")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          dueDate,
          priority,
          projectId: finalProjectId,
          assignedToId: assignedToId === "none" ? null : assignedToId,
        }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to create task")

      toast.success("Task created successfully")
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <PlusIcon className="size-4" />
            {initialProjectId ? "Create Task" : "New Task"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialProjectId ? "Create Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
              {initialProjectId 
                ? "Assign a new task to this project." 
                : "Create a new task and assign it to a project."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!initialProjectId && (
              <div className="grid gap-2">
                <Label htmlFor="projectId">Project</Label>
                <Select name="projectId" required>
                  <SelectTrigger id="projectId">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" name="title" placeholder="e.g. Design homepage" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Task details..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="Medium">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedToId">Assign To</Label>
              <Select name="assignedToId" defaultValue="none">
                <SelectTrigger id="assignedToId">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
