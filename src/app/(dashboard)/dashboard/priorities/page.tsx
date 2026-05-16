"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  SkipForward,
  Clock,
  CalendarClock,
  Zap,
} from "lucide-react";

// Mock data
const priorityQueue = [
  {
    id: "1",
    title: "Review Pull Requests",
    category: "WORK" as const,
    priority: "CRITICAL" as const,
    priorityScore: 91,
    deadline: new Date(Date.now() + 2 * 3600000).toISOString(),
    estimatedDuration: 30,
    energyLevel: "HIGH" as const,
    reasoning: [
      "Critical priority with deadline in 2 hours",
      "High energy task — matches your current peak productivity window",
      "Quick 30-minute task — perfect for immediate progress",
    ],
  },
  {
    id: "2",
    title: "Prepare Q2 Marketing Report",
    category: "WORK" as const,
    priority: "HIGH" as const,
    priorityScore: 82,
    deadline: new Date(Date.now() + 6 * 3600000).toISOString(),
    estimatedDuration: 45,
    energyLevel: "MEDIUM" as const,
    reasoning: [],
  },
  {
    id: "8",
    title: "Fix CSS layout bug on landing page",
    category: "WORK" as const,
    priority: "HIGH" as const,
    priorityScore: 74,
    deadline: new Date(Date.now() + 12 * 3600000).toISOString(),
    estimatedDuration: 30,
    energyLevel: "MEDIUM" as const,
    reasoning: [],
  },
  {
    id: "3",
    title: "Team standup meeting",
    category: "WORK" as const,
    priority: "MEDIUM" as const,
    priorityScore: 67,
    deadline: new Date(Date.now() + 3 * 3600000).toISOString(),
    estimatedDuration: 15,
    energyLevel: "LOW" as const,
    reasoning: [],
  },
  {
    id: "4",
    title: "Study Machine Learning Ch.5",
    category: "STUDY" as const,
    priority: "MEDIUM" as const,
    priorityScore: 56,
    deadline: new Date(Date.now() + 24 * 3600000).toISOString(),
    estimatedDuration: 60,
    energyLevel: "HIGH" as const,
    reasoning: [],
  },
  {
    id: "5",
    title: "Update portfolio website",
    category: "PERSONAL" as const,
    priority: "MEDIUM" as const,
    priorityScore: 44,
    deadline: new Date(Date.now() + 144 * 3600000).toISOString(),
    estimatedDuration: 90,
    energyLevel: "MEDIUM" as const,
    reasoning: [],
  },
  {
    id: "6",
    title: "Buy groceries",
    category: "PERSONAL" as const,
    priority: "LOW" as const,
    priorityScore: 23,
    deadline: null,
    estimatedDuration: 20,
    energyLevel: "LOW" as const,
    reasoning: [],
  },
];

const categoryDots: Record<string, string> = {
  WORK: "bg-indigo-400",
  STUDY: "bg-violet-400",
  PERSONAL: "bg-emerald-400",
};

const priorityColors: Record<string, string> = {
  LOW: "text-emerald-400",
  MEDIUM: "text-amber-400",
  HIGH: "text-orange-400",
  CRITICAL: "text-red-400",
};

function formatDeadline(d: string | null): string {
  if (!d) return "No deadline";
  const hours = (new Date(d).getTime() - Date.now()) / 3600000;
  if (hours < 0) return "Overdue";
  if (hours < 1) return `${Math.round(hours * 60)}m left`;
  if (hours < 24) return `${Math.round(hours)}h left`;
  if (hours < 48) return "Tomorrow";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PrioritiesPage() {
  const topTask = priorityQueue[0];
  const remaining = priorityQueue.slice(1);

  if (priorityQueue.length === 0) {
    return <EmptyState variant="priorities" />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          AI Priorities
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-ranked tasks based on urgency, importance, energy, and your habits
        </p>
      </motion.div>

      {/* Hero: Top Priority Card */}
      <motion.div variants={fadeInUp}>
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden relative">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <CardHeader className="relative">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Says Do This Next
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-foreground">
                  {topTask.title}
                </h2>

                {/* Metadata pills */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className={cn("w-2 h-2 rounded-full", categoryDots[topTask.category])} />
                    {topTask.category}
                  </span>
                  <Badge variant="outline" className={cn("text-[10px]", priorityColors[topTask.priority])}>
                    {topTask.priority}
                  </Badge>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <CalendarClock className="h-3 w-3" />
                    {formatDeadline(topTask.deadline)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {topTask.estimatedDuration}m
                  </span>
                </div>

                {/* AI Reasoning */}
                {topTask.reasoning.length > 0 && (
                  <ul className="space-y-1.5 mt-2">
                    {topTask.reasoning.map((reason, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confidence badge */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28" fill="none" stroke="currentColor"
                      className="text-primary"
                      strokeWidth="4"
                      strokeDasharray={`${(topTask.priorityScore / 100) * 175.9} 175.9`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                    {topTask.priorityScore}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">AI Score</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button className="rounded-full gap-2 shadow-md shadow-primary/20">
                <ArrowRight className="h-4 w-4" />
                Start Now
              </Button>
              <Button variant="ghost" className="rounded-full gap-2">
                <SkipForward className="h-4 w-4" />
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Priority Queue */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-muted-foreground" />
          Priority Queue
        </h2>

        <div className="space-y-1.5">
          {remaining.map((task, i) => (
            <motion.div
              key={task.id}
              variants={fadeInUp}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl",
                "bg-card border border-border/50",
                "hover:bg-muted/30 transition-colors group"
              )}
            >
              {/* Rank */}
              <span className="text-sm font-bold text-muted-foreground/50 w-6 text-center shrink-0">
                #{i + 2}
              </span>

              {/* Category dot */}
              <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", categoryDots[task.category])} />

              {/* Title */}
              <span className="flex-1 text-sm font-medium text-foreground truncate">
                {task.title}
              </span>

              {/* Score bar */}
              <div className="hidden sm:flex items-center gap-2 w-32 shrink-0">
                <Progress value={task.priorityScore} className="h-1.5 flex-1" />
                <span className="text-xs font-mono text-muted-foreground w-6 text-right">
                  {task.priorityScore}
                </span>
              </div>

              {/* Priority badge */}
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] h-5 hidden sm:inline-flex shrink-0",
                  priorityColors[task.priority]
                )}
              >
                {task.priority}
              </Badge>

              {/* Deadline */}
              <span className="text-xs text-muted-foreground shrink-0 hidden md:block w-20 text-right">
                {formatDeadline(task.deadline)}
              </span>

              {/* Duration */}
              <span className="text-xs text-muted-foreground shrink-0 hidden lg:flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedDuration}m
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
