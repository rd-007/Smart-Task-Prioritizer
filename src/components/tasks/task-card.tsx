"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/motion-variants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  Zap,
  Battery,
  BatteryMedium,
  CalendarClock,
  GripVertical,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

export interface TaskCardProps {
  id: string;
  title: string;
  category: "WORK" | "STUDY" | "PERSONAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  deadline?: string | null;
  estimatedDuration?: number | null;
  energyLevel?: "LOW" | "MEDIUM" | "HIGH";
  priorityScore?: number | null;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isDraggable?: boolean;
  className?: string;
}

// ============================================================
// Helpers
// ============================================================

const priorityConfig = {
  LOW: { label: "Low", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  MEDIUM: { label: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  HIGH: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  CRITICAL: { label: "Critical", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const categoryConfig = {
  WORK: { label: "Work", dot: "bg-indigo-400" },
  STUDY: { label: "Study", dot: "bg-violet-400" },
  PERSONAL: { label: "Personal", dot: "bg-emerald-400" },
};

const energyIcons = {
  LOW: Battery,
  MEDIUM: BatteryMedium,
  HIGH: Zap,
};

function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return "Overdue";
  if (diffHours < 1) return `${Math.round(diffHours * 60)}m left`;
  if (diffHours < 24) return `${Math.round(diffHours)}h left`;
  if (diffHours < 48) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getDeadlineUrgency(deadline: string): string {
  const diffMs = new Date(deadline).getTime() - Date.now();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 0) return "text-red-400";
  if (diffHours < 6) return "text-orange-400";
  if (diffHours < 24) return "text-amber-400";
  return "text-muted-foreground";
}

// ============================================================
// Component
// ============================================================

export function TaskCard({
  id,
  title,
  category,
  priority,
  status,
  deadline,
  estimatedDuration,
  energyLevel = "MEDIUM",
  priorityScore,
  onComplete,
  onEdit,
  onDelete,
  isDraggable = false,
  className,
}: TaskCardProps) {
  const isDone = status === "DONE";
  const EnergyIcon = energyIcons[energyLevel];
  const priorityCfg = priorityConfig[priority];
  const categoryCfg = categoryConfig[category];

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-2xl",
        "bg-card border border-border/50",
        "transition-colors duration-150",
        isDone && "opacity-60",
        className
      )}
    >
      {/* Drag handle */}
      {isDraggable && (
        <div className="flex-shrink-0 pt-0.5 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Complete button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onComplete?.(id)}
            className={cn(
              "flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 transition-all duration-200",
              "flex items-center justify-center cursor-pointer",
              isDone
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/40 hover:border-primary hover:bg-primary/10"
            )}
            aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
          >
            {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {isDone ? "Mark incomplete" : "Mark complete"}
        </TooltipContent>
      </Tooltip>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "text-sm font-medium leading-snug",
              isDone ? "line-through text-muted-foreground" : "text-foreground"
            )}
          >
            {title}
          </h3>

          {/* Priority score badge */}
          {priorityScore != null && (
            <Tooltip>
              <TooltipTrigger>
                <span
                  className={cn(
                    "flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-md",
                    priorityScore >= 70
                      ? "bg-red-500/10 text-red-400"
                      : priorityScore >= 40
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {Math.round(priorityScore)}
                </span>
              </TooltipTrigger>
              <TooltipContent>AI Priority Score</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category */}
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className={cn("w-2 h-2 rounded-full", categoryCfg.dot)} />
            {categoryCfg.label}
          </span>

          {/* Priority */}
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 h-5 font-medium", priorityCfg.color)}
          >
            {priorityCfg.label}
          </Badge>

          {/* Deadline */}
          {deadline && (
            <span
              className={cn(
                "flex items-center gap-1",
                getDeadlineUrgency(deadline)
              )}
            >
              <CalendarClock className="w-3 h-3" />
              {formatDeadline(deadline)}
            </span>
          )}

          {/* Duration */}
          {estimatedDuration && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {estimatedDuration}m
            </span>
          )}

          {/* Energy */}
          <Tooltip>
            <TooltipTrigger>
              <EnergyIcon
                className={cn(
                  "w-3.5 h-3.5",
                  energyLevel === "HIGH"
                    ? "text-amber-400"
                    : energyLevel === "MEDIUM"
                      ? "text-blue-400"
                      : "text-muted-foreground"
                )}
              />
            </TooltipTrigger>
            <TooltipContent>{energyLevel} energy</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0 h-7 w-7 rounded-lg",
              "opacity-0 group-hover:opacity-100 transition-opacity"
            )}
            aria-label="Task actions"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => onEdit?.(id)}>
            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onComplete?.(id)}>
            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
            {isDone ? "Undo" : "Complete"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete?.(id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
