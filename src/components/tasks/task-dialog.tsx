"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

// ============================================================
// Types
// ============================================================

export interface TaskFormData {
  title: string;
  description: string;
  category: "WORK" | "STUDY" | "PERSONAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  deadline: Date | null;
  estimatedDuration: number | null;
  energyLevel: "LOW" | "MEDIUM" | "HIGH";
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Partial<TaskFormData>;
  mode?: "create" | "edit";
}

const defaultFormData: TaskFormData = {
  title: "",
  description: "",
  category: "PERSONAL",
  priority: "MEDIUM",
  deadline: null,
  estimatedDuration: 30,
  energyLevel: "MEDIUM",
};

// ============================================================
// Config
// ============================================================

const categories = [
  { value: "WORK" as const, label: "Work", dot: "bg-indigo-400" },
  { value: "STUDY" as const, label: "Study", dot: "bg-violet-400" },
  { value: "PERSONAL" as const, label: "Personal", dot: "bg-emerald-400" },
];

const priorities = [
  { value: "LOW" as const, label: "Low", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25" },
  { value: "MEDIUM" as const, label: "Medium", color: "bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25" },
  { value: "HIGH" as const, label: "High", color: "bg-orange-500/15 text-orange-400 border-orange-500/20 hover:bg-orange-500/25" },
  { value: "CRITICAL" as const, label: "Critical", color: "bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25" },
];

const energyLevels = [
  { value: "LOW" as const, label: "🔋 Low", desc: "Routine tasks" },
  { value: "MEDIUM" as const, label: "⚡ Medium", desc: "Regular focus" },
  { value: "HIGH" as const, label: "🔥 High", desc: "Deep work" },
];

// ============================================================
// Component
// ============================================================

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "create",
}: TaskDialogProps) {
  const [form, setForm] = useState<TaskFormData>({ ...defaultFormData, ...initialData });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setForm({ ...defaultFormData, ...initialData });
      setErrors({});
      setShowCalendar(false);
    }
  }, [open, initialData]);

  const updateField = <K extends keyof TaskFormData>(
    key: K,
    value: TaskFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
    } catch {
      // error handling via toast in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl border-border/50 p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">
            {mode === "create" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="task-title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Title *
            </label>
            <Input
              id="task-title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={cn(
                "h-10 rounded-xl bg-muted/40 border-border/50",
                errors.title && "border-red-500 focus-visible:ring-red-500/30"
              )}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="task-desc" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <textarea
              id="task-desc"
              placeholder="Add details (optional)"
              rows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={cn(
                "w-full resize-none rounded-xl bg-muted/40 border border-border/50 px-3 py-2",
                "text-sm placeholder:text-muted-foreground/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Category
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 rounded-xl bg-muted/40 border-border/50"
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", categories.find((c) => c.value === form.category)?.dot)} />
                    {categories.find((c) => c.value === form.category)?.label}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.value}
                    onClick={() => updateField("category", cat.value)}
                    className={cn(form.category === cat.value && "bg-accent")}
                  >
                    <span className={cn("w-2.5 h-2.5 rounded-full mr-2", cat.dot)} />
                    {cat.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Deadline
            </label>
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full justify-start h-10 rounded-xl bg-muted/40 border-border/50 font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {form.deadline
                ? format(form.deadline, "PPP")
                : "Pick a deadline (optional)"}
            </Button>
            {showCalendar && (
              <div className="border border-border/50 rounded-xl p-3 bg-card">
                <Calendar
                  mode="single"
                  selected={form.deadline || undefined}
                  onSelect={(date) => {
                    updateField("deadline", date || null);
                    setShowCalendar(false);
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </div>
            )}
          </div>

          {/* Duration + Energy row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Estimated Duration */}
            <div className="space-y-1.5">
              <label htmlFor="task-duration" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Duration
              </label>
              <div className="relative">
                <Input
                  id="task-duration"
                  type="number"
                  min={1}
                  max={480}
                  placeholder="30"
                  value={form.estimatedDuration || ""}
                  onChange={(e) =>
                    updateField(
                      "estimatedDuration",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="h-10 pr-14 rounded-xl bg-muted/40 border-border/50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  mins
                </span>
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Energy
              </label>
              <div className="flex gap-1">
                {energyLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => updateField("energyLevel", level.value)}
                    className={cn(
                      "flex-1 h-10 rounded-xl text-xs font-medium transition-all border cursor-pointer",
                      form.energyLevel === level.value
                        ? "bg-primary/15 border-primary/30 text-primary"
                        : "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted/60"
                    )}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Priority
            </label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => updateField("priority", p.value)}
                  className={cn(
                    "flex-1 h-9 rounded-xl text-xs font-medium transition-all border cursor-pointer",
                    form.priority === p.value
                      ? p.color
                      : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full gap-2 shadow-md shadow-primary/20"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "create" ? "Add Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
