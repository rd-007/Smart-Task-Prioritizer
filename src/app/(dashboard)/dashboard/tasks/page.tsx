"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskDialog, TaskFormData } from "@/components/tasks/task-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ListTodo,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

// Mock data
const allTasks = [
  { id: "1", title: "Review Pull Requests", category: "WORK" as const, priority: "CRITICAL" as const, status: "TODO" as const, deadline: new Date(Date.now() + 2 * 3600000).toISOString(), estimatedDuration: 30, energyLevel: "HIGH" as const, priorityScore: 91 },
  { id: "2", title: "Prepare Q2 Marketing Report", category: "WORK" as const, priority: "HIGH" as const, status: "IN_PROGRESS" as const, deadline: new Date(Date.now() + 6 * 3600000).toISOString(), estimatedDuration: 45, energyLevel: "MEDIUM" as const, priorityScore: 82 },
  { id: "3", title: "Team standup meeting", category: "WORK" as const, priority: "MEDIUM" as const, status: "TODO" as const, deadline: new Date(Date.now() + 3 * 3600000).toISOString(), estimatedDuration: 15, energyLevel: "LOW" as const, priorityScore: 67 },
  { id: "4", title: "Study Machine Learning Ch.5", category: "STUDY" as const, priority: "MEDIUM" as const, status: "TODO" as const, deadline: new Date(Date.now() + 24 * 3600000).toISOString(), estimatedDuration: 60, energyLevel: "HIGH" as const, priorityScore: 56 },
  { id: "5", title: "Update portfolio website", category: "PERSONAL" as const, priority: "MEDIUM" as const, status: "TODO" as const, deadline: new Date(Date.now() + 144 * 3600000).toISOString(), estimatedDuration: 90, energyLevel: "MEDIUM" as const, priorityScore: 44 },
  { id: "6", title: "Buy groceries", category: "PERSONAL" as const, priority: "LOW" as const, status: "DONE" as const, deadline: null, estimatedDuration: 20, energyLevel: "LOW" as const, priorityScore: 23 },
  { id: "7", title: "Write blog post about React Server Components", category: "WORK" as const, priority: "MEDIUM" as const, status: "TODO" as const, deadline: new Date(Date.now() + 72 * 3600000).toISOString(), estimatedDuration: 120, energyLevel: "HIGH" as const, priorityScore: 51 },
  { id: "8", title: "Fix CSS layout bug on landing page", category: "WORK" as const, priority: "HIGH" as const, status: "IN_PROGRESS" as const, deadline: new Date(Date.now() + 12 * 3600000).toISOString(), estimatedDuration: 30, energyLevel: "MEDIUM" as const, priorityScore: 74 },
];

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "DONE";
type SortOption = "priorityScore" | "deadline" | "createdAt";

export default function TasksPage() {
  const [tasks, setTasks] = useState(allTasks);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("priorityScore");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchQuery) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "priorityScore") {
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      }
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

    return result;
  }, [tasks, statusFilter, categoryFilter, sortBy, searchQuery]);

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "DONE" ? ("TODO" as const) : ("DONE" as const) } : t
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = async (data: TaskFormData) => {
    setTasks((prev) => [
      {
        id: Date.now().toString(),
        title: data.title,
        category: data.category,
        priority: data.priority,
        status: "TODO" as const,
        deadline: data.deadline?.toISOString() || null,
        estimatedDuration: data.estimatedDuration || 30,
        energyLevel: data.energyLevel,
        priorityScore: null,
      },
      ...prev,
    ]);
  };

  const statusCounts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
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
            <ListTodo className="h-6 w-6 text-primary" />
            All Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} total • {statusCounts.TODO} pending • {statusCounts.DONE} completed
          </p>
        </div>
        <Button
          className="rounded-full gap-2 shadow-md shadow-primary/20"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-full bg-muted/40 border-border/50"
          />
        </div>

        {/* Status tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-9 bg-muted/40 rounded-full">
            {(["ALL", "TODO", "IN_PROGRESS", "DONE"] as const).map((s) => (
              <TabsTrigger
                key={s}
                value={s}
                className="rounded-full text-xs px-3 data-[state=active]:shadow-sm"
              >
                {s === "ALL" ? "All" : s === "IN_PROGRESS" ? "In Progress" : s === "TODO" ? "To Do" : "Done"}
                <Badge
                  variant="secondary"
                  className="ml-1.5 h-4 min-w-4 px-1 text-[10px] rounded-full"
                >
                  {statusCounts[s]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Category + Sort */}
        <div className="flex gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 rounded-full gap-1.5 text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {categoryFilter === "ALL" ? "Category" : categoryFilter}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["ALL", "WORK", "STUDY", "PERSONAL"].map((c) => (
                <DropdownMenuItem
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={cn(categoryFilter === c && "bg-accent")}
                >
                  {c === "ALL" ? "All Categories" : c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 rounded-full gap-1.5 text-xs">
                Sort
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("priorityScore")} className={cn(sortBy === "priorityScore" && "bg-accent")}>
                Priority Score
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("deadline")} className={cn(sortBy === "deadline" && "bg-accent")}>
                Deadline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          variant="tasks"
          title={searchQuery ? "No matching tasks" : undefined}
          description={searchQuery ? `No tasks match "${searchQuery}"` : undefined}
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {filteredTasks.map((task) => (
            <motion.div key={task.id} variants={fadeInUp}>
              <TaskCard
                {...task}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddTask}
        mode="create"
      />
    </motion.div>
  );
}
