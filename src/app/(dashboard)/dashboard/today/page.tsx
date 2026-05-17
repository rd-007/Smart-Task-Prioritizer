"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskDialog, TaskFormData } from "@/components/tasks/task-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Sparkles, RefreshCw, Plus, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

// Types
interface Task {
  id: string;
  title: string;
  category: "WORK" | "STUDY" | "PERSONAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  deadline: string | null;
  estimatedDuration: number;
  energyLevel: "LOW" | "MEDIUM" | "HIGH";
  priorityScore: number | null;
}

// Mock data — will be replaced with API calls
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review Pull Requests",
    category: "WORK",
    priority: "CRITICAL",
    status: "TODO",
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 30,
    energyLevel: "HIGH",
    priorityScore: 91,
  },
  {
    id: "2",
    title: "Prepare Q2 Marketing Report",
    category: "WORK",
    priority: "HIGH",
    status: "IN_PROGRESS",
    deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 45,
    energyLevel: "MEDIUM",
    priorityScore: 82,
  },
  {
    id: "3",
    title: "Team standup meeting",
    category: "WORK",
    priority: "MEDIUM",
    status: "TODO",
    deadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 15,
    energyLevel: "LOW",
    priorityScore: 67,
  },
  {
    id: "4",
    title: "Study Machine Learning Ch.5",
    category: "STUDY",
    priority: "MEDIUM",
    status: "TODO",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 60,
    energyLevel: "HIGH",
    priorityScore: 56,
  },
  {
    id: "5",
    title: "Update portfolio website",
    category: "PERSONAL",
    priority: "MEDIUM",
    status: "TODO",
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 90,
    energyLevel: "MEDIUM",
    priorityScore: 44,
  },
  {
    id: "6",
    title: "Buy groceries",
    category: "PERSONAL",
    priority: "LOW",
    status: "DONE",
    deadline: null,
    estimatedDuration: 20,
    energyLevel: "LOW",
    priorityScore: 23,
  },
];

export default function TodayPlanPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeTasks = tasks.filter((t) => t.status !== "DONE");
  const completedTasks = tasks.filter((t) => t.status === "DONE");
  const totalMinutes = activeTasks.reduce(
    (sum, t) => sum + (t.estimatedDuration || 0),
    0
  );

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: (t.status === "DONE" ? "TODO" : "DONE") as Task["status"] }
          : t
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = async (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      category: data.category,
      priority: data.priority,
      status: "TODO",
      deadline: data.deadline?.toISOString() || null,
      estimatedDuration: data.estimatedDuration || 30,
      energyLevel: data.energyLevel,
      priorityScore: null,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-primary" />
            Today&apos;s Plan
          </h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d")} —{" "}
            <span className="text-foreground">{activeTasks.length} tasks</span>,
            ~{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m of work
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
          <Button
            size="sm"
            className="rounded-full gap-2 shadow-md shadow-primary/20"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* Task list */}
      <div className="max-w-2xl mx-auto">
        {tasks.length === 0 ? (
          <EmptyState variant="tasks" onAction={() => setDialogOpen(true)} />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {/* Active tasks */}
            {activeTasks.map((task, i) => (
              <motion.div key={task.id} variants={fadeInUp}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground/50 w-5 text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <TaskCard
                      {...task}
                      onComplete={handleComplete}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Completed section */}
            {completedTasks.length > 0 && (
              <motion.div variants={fadeInUp} className="pt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 pl-8">
                  Completed ({completedTasks.length})
                </p>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <span className="w-5 shrink-0" />
                      <div className="flex-1">
                        <TaskCard
                          {...task}
                          onComplete={handleComplete}
                          onDelete={handleDelete}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddTask}
        mode="create"
      />

      {/* FAB for mobile */}
      <Button
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full sm:hidden",
          "shadow-lg shadow-primary/30 z-40"
        )}
        onClick={() => setDialogOpen(true)}
        aria-label="Add task"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}
