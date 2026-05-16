"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Plus, Inbox, CalendarOff, BarChart3, Brain } from "lucide-react";

interface EmptyStateProps {
  variant?: "tasks" | "schedule" | "analytics" | "priorities" | "default";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig = {
  tasks: {
    icon: Inbox,
    title: "No tasks yet",
    description: "A quiet field. Time to plant something.",
    actionLabel: "Add First Task",
  },
  schedule: {
    icon: CalendarOff,
    title: "No schedule for today",
    description: "Generate an AI-powered schedule to organize your day.",
    actionLabel: "Generate Schedule",
  },
  analytics: {
    icon: BarChart3,
    title: "Not enough data",
    description: "Complete a few tasks to unlock productivity insights.",
    actionLabel: undefined,
  },
  priorities: {
    icon: Brain,
    title: "No priorities calculated",
    description: "Add tasks and let AI figure out what matters most.",
    actionLabel: "Add a Task",
  },
  default: {
    icon: Inbox,
    title: "Nothing here yet",
    description: "Get started by adding your first item.",
    actionLabel: "Get Started",
  },
};

export function EmptyState({
  variant = "default",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.title;
  const displayDesc = description || config.description;
  const displayAction = actionLabel || config.actionLabel;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "py-16 px-6",
        className
      )}
    >
      {/* Icon with glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
        <div
          className={cn(
            "relative w-16 h-16 rounded-2xl",
            "bg-muted/50 border border-border/50",
            "flex items-center justify-center"
          )}
        >
          <Icon className="w-7 h-7 text-muted-foreground" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-foreground mb-1.5">
        {displayTitle}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {displayDesc}
      </p>

      {/* CTA */}
      {displayAction && onAction && (
        <Button
          onClick={onAction}
          className="rounded-full gap-2 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          {displayAction}
        </Button>
      )}
    </motion.div>
  );
}
