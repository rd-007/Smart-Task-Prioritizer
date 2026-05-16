"use client";

import { useState, useCallback } from "react";
import { TaskFormData } from "@/components/tasks/task-dialog";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  category: "WORK" | "STUDY" | "PERSONAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  deadline: string | null;
  estimatedDuration: number | null;
  energyLevel: "LOW" | "MEDIUM" | "HIGH";
  priorityScore: number | null;
}

/**
 * Hook for managing tasks with API integration and AI priority scoring.
 * Handles CRUD operations and automatically triggers priority prediction.
 */
export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);

  // Create task + trigger AI priority scoring
  const createTask = useCallback(async (data: TaskFormData) => {
    setLoading(true);
    try {
      // 1. Create task via API
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          deadline: data.deadline?.toISOString() || null,
          estimatedDuration: data.estimatedDuration,
          energyLevel: data.energyLevel,
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");
      const { task } = await response.json();

      // 2. Trigger AI priority scoring (fire-and-forget)
      scorePriority(task).catch(() => {
        // Non-critical — task was still created
      });

      setTasks((prev) => [task, ...prev]);
      toast.success("Task created", {
        description: task.title,
      });

      return task;
    } catch (error) {
      toast.error("Failed to create task");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update task + re-score priority if relevant fields changed
  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error("Failed to update task");
        const { task } = await response.json();

        // Re-score if priority-relevant fields changed
        const rescoreFields = [
          "priority",
          "deadline",
          "category",
          "energyLevel",
          "estimatedDuration",
        ];
        const needsRescore = Object.keys(updates).some((k) =>
          rescoreFields.includes(k)
        );

        if (needsRescore) {
          scorePriority(task).catch(() => {});
        }

        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...task } : t))
        );

        if (updates.status === "DONE") {
          toast.success("Task completed! 🎉", { description: task.title });
        }

        return task;
      } catch (error) {
        toast.error("Failed to update task");
        throw error;
      }
    },
    []
  );

  // Complete / uncomplete toggle
  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const newStatus = task.status === "DONE" ? "TODO" : "DONE";
      return updateTask(id, { status: newStatus } as Partial<Task>);
    },
    [tasks, updateTask]
  );

  // Delete task
  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      throw error;
    }
  }, []);

  // Fetch all tasks
  const fetchTasks = useCallback(async (params?: Record<string, string>) => {
    setLoading(true);
    try {
      const query = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      const response = await fetch(`/api/tasks${query}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const { tasks: fetchedTasks } = await response.json();
      setTasks(fetchedTasks);
      return fetchedTasks;
    } catch (error) {
      toast.error("Failed to load tasks");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    setTasks,
    loading,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    fetchTasks,
  };
}

/**
 * Call AI service to predict priority score and save it to the task.
 */
async function scorePriority(task: Task) {
  try {
    // Calculate days since creation
    const daysSinceCreation = 0; // Fresh task

    const response = await fetch("/api/tasks/" + task.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // We'll trigger AI scoring from the API side
        // For now, use a simple heuristic
        priorityScore: calculateLocalScore(task),
      }),
    });

    if (!response.ok) throw new Error("Failed to update priority score");
  } catch (error) {
    console.error("[Priority Score] Failed:", error);
  }
}

/**
 * Local fallback priority calculation when AI service is unavailable.
 */
function calculateLocalScore(task: Task): number {
  let score = 0;

  // Priority weight (30%)
  const priorityMap = { LOW: 20, MEDIUM: 50, HIGH: 80, CRITICAL: 100 };
  score += (priorityMap[task.priority] || 50) * 0.3;

  // Deadline urgency (35%)
  if (task.deadline) {
    const hoursLeft =
      (new Date(task.deadline).getTime() - Date.now()) / 3600000;
    if (hoursLeft <= 0) score += 100 * 0.35;
    else if (hoursLeft <= 6) score += 90 * 0.35;
    else if (hoursLeft <= 24) score += 70 * 0.35;
    else if (hoursLeft <= 72) score += 50 * 0.35;
    else score += 25 * 0.35;
  } else {
    score += 30 * 0.35;
  }

  // Category (15%)
  const catMap = { WORK: 70, STUDY: 60, PERSONAL: 40 };
  score += (catMap[task.category] || 50) * 0.15;

  // Duration quick-win (10%)
  const dur = task.estimatedDuration || 30;
  if (dur <= 15) score += 75 * 0.1;
  else if (dur <= 30) score += 60 * 0.1;
  else score += 40 * 0.1;

  // Energy (10%)
  const energyMap = { HIGH: 70, MEDIUM: 50, LOW: 35 };
  score += (energyMap[task.energyLevel] || 50) * 0.1;

  return Math.round(Math.min(100, Math.max(0, score)));
}
