"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { caseLabel, type Task } from "@/lib/data"
import { cn } from "@/lib/utils"

const filters = [
  { value: "all", label: "All" },
  { value: "mine", label: "Mine" },
  { value: "overdue", label: "Overdue" },
  { value: "done", label: "Done" },
]

// The Tasks page list: filter tabs, search, and tasks grouped into Open and Done.
// Ticking a checkbox moves the task between the groups (in the browser only, nothing is saved).
export function TaskList({ tasks, currentUser }: { tasks: Task[]; currentUser: string }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [doneIds, setDoneIds] = useState(() => new Set(tasks.filter((t) => t.done).map((t) => t.id)))

  const toggle = (id: string, checked: boolean) =>
    setDoneIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })

  const shown = tasks.filter((t) => {
    const done = doneIds.has(t.id)
    const matchesFilter =
      filter === "all" ||
      (filter === "mine" && t.assignee === currentUser) ||
      (filter === "overdue" && t.overdue && !done) ||
      (filter === "done" && done)
    const text = `${t.title} ${caseLabel(t.caseId)} ${t.assignee}`.toLowerCase()
    return matchesFilter && text.includes(query.toLowerCase())
  })

  const groups = [
    { label: "Open", items: shown.filter((t) => !doneIds.has(t.id)) },
    { label: "Done", items: shown.filter((t) => doneIds.has(t.id)) },
  ].filter((g) => g.items.length > 0)

  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {filters.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="h-9 pl-9" />
        </div>
        {/* TODO(class): this button does nothing yet. */}
        <Button className="h-9 px-4">
          <Plus />
          New task
        </Button>
      </div>

      <div className="space-y-6 p-6">
        {groups.length === 0 && <p className="py-3 text-sm text-muted-foreground">No tasks match.</p>}
        {groups.map((group) => (
          <section key={group.label}>
            <h3 className="text-sm font-semibold text-muted-foreground">
              {group.label} · {group.items.length}
            </h3>
            <ul className="divide-y">
              {group.items.map((task) => {
                const done = doneIds.has(task.id)
                return (
                  <li key={task.id} className="flex items-center gap-3 py-3.5">
                    <Checkbox
                      id={task.id}
                      className="size-5"
                      checked={done}
                      onCheckedChange={(checked) => toggle(task.id, checked === true)}
                    />
                    <label
                      htmlFor={task.id}
                      className={cn("min-w-0 flex-1 text-[15px]", done && "text-muted-foreground line-through")}
                    >
                      {task.title}
                    </label>
                    <Badge variant="outline" className="h-6 px-2.5 text-[13px] text-muted-foreground max-sm:hidden">
                      {caseLabel(task.caseId)}
                    </Badge>
                    <span
                      className={cn(
                        "w-14 text-right text-sm font-semibold",
                        done ? "text-muted-foreground" : task.overdue && "text-destructive"
                      )}
                    >
                      {task.due}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
