"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/tasks/task-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BrainCircuit,
  Zap,
  Timer,
  TrendingUp,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

// ============================================================
// Mock data (will be replaced with API calls)
// ============================================================

const mockTasks = [
  {
    id: "1",
    title: "Review Pull Requests",
    category: "WORK" as const,
    priority: "CRITICAL" as const,
    status: "TODO" as const,
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 30,
    energyLevel: "HIGH" as const,
    priorityScore: 91,
  },
  {
    id: "2",
    title: "Prepare Q2 Marketing Report",
    category: "WORK" as const,
    priority: "HIGH" as const,
    status: "IN_PROGRESS" as const,
    deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 45,
    energyLevel: "MEDIUM" as const,
    priorityScore: 82,
  },
  {
    id: "3",
    title: "Study Machine Learning Ch.5",
    category: "STUDY" as const,
    priority: "MEDIUM" as const,
    status: "TODO" as const,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 60,
    energyLevel: "HIGH" as const,
    priorityScore: 56,
  },
];

const mockScheduleBlocks = [
  { time: "9:00", task: "Review PRs", type: "DEEP_WORK", width: "12.5%" },
  { time: "9:30", task: "Break", type: "BREAK", width: "6.25%" },
  { time: "9:45", task: "Q2 Report", type: "DEEP_WORK", width: "18.75%" },
  { time: "10:30", task: "Break", type: "BREAK", width: "6.25%" },
  { time: "10:45", task: "ML Study", type: "DEEP_WORK", width: "25%" },
  { time: "12:00", task: "Lunch", type: "BREAK", width: "12.5%" },
];

// ============================================================
// Sub-components
// ============================================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = "text-primary",
  children,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  accentColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="border-border/50 bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={cn("h-4 w-4", accentColor)} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ScheduleTimeline() {
  const blockColors: Record<string, string> = {
    DEEP_WORK: "bg-primary/20 border-primary/30 text-primary",
    BREAK: "bg-muted/50 border-border/50 text-muted-foreground",
  };

  return (
    <div className="flex items-stretch gap-1 h-12 rounded-xl overflow-hidden bg-muted/20 border border-border/50">
      {mockScheduleBlocks.map((block, i) => (
        <div
          key={i}
          style={{ width: block.width }}
          className={cn(
            "flex items-center justify-center px-1 text-[10px] font-medium rounded-lg border",
            "truncate transition-all hover:scale-[1.02]",
            blockColors[block.type] || blockColors.DEEP_WORK
          )}
          title={`${block.time} — ${block.task}`}
        >
          <span className="truncate">{block.task}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Dashboard Page
// ============================================================

export default function DashboardPage() {
  const userName = "Rajit";
  const taskCount = 8;
  const focusWindow = "10:00 AM – 1:00 PM";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Greeting */}
      <motion.div variants={fadeInUp} className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Good Morning, {userName} 👋
        </h1>
        <p className="text-muted-foreground">
          You have <span className="text-foreground font-medium">{taskCount} tasks</span> today.
          Your best focus window is{" "}
          <span className="text-primary font-medium">{focusWindow}</span>
        </p>
      </motion.div>

      {/* Row 1: Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="AI Priority Queue"
          value="3 urgent"
          subtitle="2 critical, 1 high priority"
          icon={BrainCircuit}
          accentColor="text-primary"
        >
          <div className="mt-3 space-y-1.5">
            {mockTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-foreground truncate pr-2">
                  {task.title}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] h-5 px-1.5 shrink-0",
                    task.priorityScore >= 70
                      ? "text-red-400 border-red-500/20"
                      : "text-amber-400 border-amber-500/20"
                  )}
                >
                  {task.priorityScore}
                </Badge>
              </div>
            ))}
          </div>
        </StatCard>

        <StatCard
          title="Productivity Score"
          value="78%"
          subtitle="↑ 5% from last week"
          icon={TrendingUp}
          accentColor="text-emerald-400"
        >
          <Progress value={78} className="mt-3 h-2" />
        </StatCard>

        <StatCard
          title="Focus Time Today"
          value="2h 45m"
          subtitle="Target: 4h 30m"
          icon={Timer}
          accentColor="text-amber-400"
        >
          <Progress value={61} className="mt-3 h-2" />
        </StatCard>
      </div>

      {/* Row 2: Schedule + Calendar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                Smart Schedule
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                9:00 AM — 5:00 PM
              </span>
            </CardHeader>
            <CardContent>
              <ScheduleTimeline />
              <p className="text-xs text-muted-foreground mt-3">
                5 tasks scheduled • 4h 15m total work • 2 tasks remaining
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-xs">
                <Zap className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Your peak hours are <span className="text-foreground">10 AM–1 PM</span>. High-energy tasks are scheduled there.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <BrainCircuit className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground">2 tasks</span> show procrastination signals. Consider tackling them first.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Completion rate is <span className="text-emerald-400">up 12%</span> this week. Keep it up!
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 3: Recent Tasks */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Top Priority Tasks
          </h2>
          <a
            href="/dashboard/tasks"
            className="text-sm text-primary hover:underline"
          >
            View all →
          </a>
        </div>
        <div className="space-y-2">
          {mockTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
