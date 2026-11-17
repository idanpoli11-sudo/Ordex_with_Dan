import { AppHeader } from "@/components/app/app-header"
import { StatCard } from "@/components/app/stat-card"
import { TaskList } from "@/components/app/task-list"
import { completedTasks, firm, tasks } from "@/lib/data"

export default function TasksPage() {
  return (
    <>
      <AppHeader title="Tasks" />
      <main className="mx-auto w-full max-w-[1200px] space-y-6 p-6 lg:p-8">
        <div>
          <h2 className="text-3xl font-bold">Tasks</h2>
          <p className="mt-1 text-muted-foreground">Every task across your cases, in one list.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard value={tasks.filter((t) => t.overdue).length} label="Overdue" tone="danger" />
          <StatCard value={tasks.filter((t) => t.due === "Today").length} label="Due today" />
          <StatCard value={completedTasks.length} label="Done this week" />
        </div>

        <TaskList tasks={[...tasks, ...completedTasks]} currentUser={firm.user.name} />
      </main>
    </>
  )
}
