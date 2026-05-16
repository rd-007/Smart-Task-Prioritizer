"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, ArrowRight } from "lucide-react";

interface ProcrastinationNudge {
  taskId: string;
  taskTitle: string;
  severity: "low" | "medium" | "high";
  nudgeMessage: string;
  suggestion: string;
}

interface ProcrastinationBannerProps {
  nudges: ProcrastinationNudge[];
  onStartTask?: (taskId: string) => void;
  onDismiss?: (taskId: string) => void;
}

const severityStyles = {
  low: "bg-blue-500/10 border-blue-500/20 text-blue-300",
  medium: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  high: "bg-red-500/10 border-red-500/20 text-red-300",
};

const severityIcons = {
  low: "💡",
  medium: "⚠️",
  high: "🔴",
};

export function ProcrastinationBanner({
  nudges,
  onStartTask,
  onDismiss,
}: ProcrastinationBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleNudges = nudges.filter(
    (n) => n.severity !== "low" && !dismissed.has(n.taskId)
  );

  if (visibleNudges.length === 0) return null;

  const handleDismiss = (taskId: string) => {
    setDismissed((prev) => new Set(prev).add(taskId));
    onDismiss?.(taskId);
  };

  return (
    <AnimatePresence>
      <div className="space-y-2">
        {visibleNudges.map((nudge) => (
          <motion.div
            key={nudge.taskId}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-start gap-3 px-4 py-3 rounded-xl border",
              severityStyles[nudge.severity]
            )}
          >
            <span className="text-lg shrink-0 mt-0.5">
              {severityIcons[nudge.severity]}
            </span>

            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium">{nudge.nudgeMessage}</p>
              <p className="text-xs opacity-80">{nudge.suggestion}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 rounded-full text-xs gap-1 hover:bg-white/10"
                onClick={() => onStartTask?.(nudge.taskId)}
              >
                Start <ArrowRight className="h-3 w-3" />
              </Button>
              <button
                onClick={() => handleDismiss(nudge.taskId)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5 opacity-60" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
