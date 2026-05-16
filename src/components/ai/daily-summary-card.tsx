"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface TopTask {
  id: string;
  title: string;
  priorityScore: number | null;
  category: string;
  estimatedDuration: number;
}

interface BusyZone {
  label: string;
  urgency: string;
}

interface DailySummaryProps {
  topTasks?: TopTask[];
  bestWorkWindow?: { start: string; end: string };
  predictedBusyZones?: BusyZone[];
  motivationMessage?: string;
  totalEstimatedMinutes?: number;
  className?: string;
}

const categoryDots: Record<string, string> = {
  WORK: "bg-indigo-400",
  STUDY: "bg-violet-400",
  PERSONAL: "bg-emerald-400",
};

export function DailySummaryCard({
  topTasks = [],
  bestWorkWindow = { start: "09:00", end: "12:00" },
  predictedBusyZones = [],
  motivationMessage = "💪 A productive day awaits. Focus on the top 3 and let momentum carry you.",
  totalEstimatedMinutes = 0,
  className,
}: DailySummaryProps) {
  return (
    <motion.div variants={fadeInUp}>
      <Card
        className={cn(
          "border-border/50 bg-gradient-to-br from-card via-card to-primary/5",
          "overflow-hidden relative",
          className
        )}
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

        <CardHeader className="relative pb-3">
          <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Today&apos;s AI Briefing
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Motivation */}
          <p className="text-sm text-foreground/80">{motivationMessage}</p>

          {/* Best work window */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div className="text-xs">
              <span className="text-muted-foreground">Best focus window: </span>
              <span className="text-foreground font-medium">
                {bestWorkWindow.start} – {bestWorkWindow.end}
              </span>
            </div>
          </div>

          {/* Top 3 tasks */}
          {topTasks.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Top Priorities
              </p>
              {topTasks.slice(0, 3).map((task, i) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 text-xs py-1"
                >
                  <span className="text-muted-foreground/50 font-mono w-4">
                    {i + 1}.
                  </span>
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      categoryDots[task.category] || "bg-muted"
                    )}
                  />
                  <span className="text-foreground flex-1 truncate">
                    {task.title}
                  </span>
                  {task.priorityScore != null && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] h-4 px-1 shrink-0",
                        task.priorityScore >= 70
                          ? "text-red-400 border-red-500/20"
                          : task.priorityScore >= 40
                            ? "text-amber-400 border-amber-500/20"
                            : "text-muted-foreground border-border"
                      )}
                    >
                      {Math.round(task.priorityScore)}
                    </Badge>
                  )}
                  <span className="text-muted-foreground shrink-0">
                    {task.estimatedDuration}m
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Busy zones */}
          {predictedBusyZones.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Heads Up
              </p>
              {predictedBusyZones.slice(0, 3).map((zone, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-amber-400" />
                  {zone.label}
                </div>
              ))}
            </div>
          )}

          {/* Total estimate */}
          {totalEstimatedMinutes > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/30">
              <TrendingUp className="h-3 w-3" />
              Total estimated: {Math.floor(totalEstimatedMinutes / 60)}h{" "}
              {totalEstimatedMinutes % 60}m
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
