"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  Timer,
} from "lucide-react";

// ============================================================
// Mock analytics data
// ============================================================

const weeklyCompletion = [
  { day: "Mon", count: 5 },
  { day: "Tue", count: 3 },
  { day: "Wed", count: 7 },
  { day: "Thu", count: 4 },
  { day: "Fri", count: 6 },
  { day: "Sat", count: 2 },
  { day: "Sun", count: 1 },
];

const categoryBreakdown = [
  { category: "Work", percentage: 45, color: "bg-indigo-400", textColor: "text-indigo-400" },
  { category: "Study", percentage: 30, color: "bg-violet-400", textColor: "text-violet-400" },
  { category: "Personal", percentage: 25, color: "bg-emerald-400", textColor: "text-emerald-400" },
];

const onTimeData = [
  { day: "Mon", onTime: 4, late: 1 },
  { day: "Tue", onTime: 3, late: 0 },
  { day: "Wed", onTime: 5, late: 2 },
  { day: "Thu", onTime: 3, late: 1 },
  { day: "Fri", onTime: 5, late: 1 },
  { day: "Sat", onTime: 2, late: 0 },
  { day: "Sun", onTime: 1, late: 0 },
];

const heatmapData = Array.from({ length: 7 }, (_, dayIdx) =>
  Array.from({ length: 12 }, (_, hourIdx) => {
    // Simulate higher activity during work hours (9-17) on weekdays
    const hour = hourIdx + 8;
    const isWeekday = dayIdx < 5;
    const isPeak = hour >= 10 && hour <= 14;
    if (!isWeekday) return Math.random() * 0.2;
    if (isPeak) return 0.6 + Math.random() * 0.4;
    if (hour >= 9 && hour <= 17) return 0.3 + Math.random() * 0.3;
    return Math.random() * 0.2;
  })
);

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourLabels = Array.from({ length: 12 }, (_, i) => {
  const h = i + 8;
  return h <= 12 ? `${h}${h === 12 ? "p" : "a"}` : `${h - 12}p`;
});

// ============================================================
// Sub-components
// ============================================================

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  accentColor,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  accentColor: string;
}) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="border-border/50">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
            <div className={cn("p-2 rounded-xl bg-muted/50")}>
              <Icon className={cn("h-4 w-4", accentColor)} />
            </div>
          </div>
          <p
            className={cn(
              "text-xs mt-2 font-medium",
              positive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {positive ? "↑" : "↓"} {change}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CompletionChart() {
  const maxCount = Math.max(...weeklyCompletion.map((d) => d.count));

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Completion Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 h-40">
          {weeklyCompletion.map((d) => {
            const heightPercent = (d.count / maxCount) * 100;
            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[10px] text-muted-foreground font-medium">
                  {d.count}
                </span>
                <div className="w-full relative rounded-t-lg overflow-hidden bg-muted/20" style={{ height: "100%" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryDonut() {
  // SVG donut
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  const segments = categoryBreakdown.map((cat) => {
    const offset = cumulative;
    cumulative += cat.percentage;
    return {
      ...cat,
      dashArray: `${(cat.percentage / 100) * circumference} ${circumference}`,
      dashOffset: -((offset / 100) * circumference),
    };
  });

  const strokeColors: Record<string, string> = {
    Work: "#818cf8",
    Study: "#a78bfa",
    Personal: "#34d399",
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" className="text-muted/10" strokeWidth="16" />
            {segments.map((seg) => (
              <circle
                key={seg.category}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={strokeColors[seg.category]}
                strokeWidth="16"
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-foreground">28</span>
            <span className="text-[10px] text-muted-foreground">tasks</span>
          </div>
        </div>

        <div className="flex gap-4">
          {categoryBreakdown.map((cat) => (
            <div key={cat.category} className="flex items-center gap-1.5 text-xs">
              <span className={cn("w-2.5 h-2.5 rounded-full", cat.color)} />
              <span className="text-muted-foreground">
                {cat.category}{" "}
                <span className={cn("font-medium", cat.textColor)}>
                  {cat.percentage}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OnTimeChart() {
  const maxTotal = Math.max(...onTimeData.map((d) => d.onTime + d.late));

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          On-Time vs Late
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {onTimeData.map((d) => {
            const total = d.onTime + d.late;
            const onTimePct = (d.onTime / Math.max(maxTotal, 1)) * 100;
            const latePct = (d.late / Math.max(maxTotal, 1)) * 100;
            return (
              <div key={d.day} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-8">
                  {d.day}
                </span>
                <div className="flex-1 flex h-4 rounded-full overflow-hidden bg-muted/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${onTimePct}%` }}
                    transition={{ duration: 0.6 }}
                    className="bg-emerald-500/60 rounded-l-full"
                  />
                  {d.late > 0 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${latePct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="bg-red-500/50"
                    />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground w-6 text-right">
                  {total}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 justify-center">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" /> On Time
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" /> Late
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityHeatmap() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Hour labels */}
          <div className="flex gap-1 ml-10">
            {hourLabels.map((h) => (
              <span
                key={h}
                className="flex-1 text-center text-[9px] text-muted-foreground"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Grid */}
          {heatmapData.map((row, dayIdx) => (
            <div key={dayIdx} className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground w-8 text-right pr-1">
                {dayLabels[dayIdx]}
              </span>
              <div className="flex gap-0.5 flex-1">
                {row.map((intensity, hourIdx) => (
                  <div
                    key={hourIdx}
                    className="flex-1 h-5 rounded-sm transition-colors"
                    style={{
                      backgroundColor: `rgba(99, 102, 241, ${intensity * 0.9})`,
                    }}
                    title={`${dayLabels[dayIdx]} ${hourLabels[hourIdx]}: ${Math.round(intensity * 100)}% activity`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-3 justify-center text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
            <div
              key={v}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: `rgba(99, 102, 241, ${v})` }}
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Analytics Page
// ============================================================

export default function AnalyticsPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your productivity trends
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasks Completed"
          value="24"
          change="12% from last week"
          positive={true}
          icon={CheckCircle2}
          accentColor="text-emerald-400"
        />
        <StatCard
          title="On-Time Rate"
          value="87%"
          change="3% from last week"
          positive={true}
          icon={TrendingUp}
          accentColor="text-primary"
        />
        <StatCard
          title="Avg Completion"
          value="1.2h"
          change="5% faster"
          positive={true}
          icon={Clock}
          accentColor="text-amber-400"
        />
        <StatCard
          title="Focus Time"
          value="18.5h"
          change="8% from last week"
          positive={true}
          icon={Timer}
          accentColor="text-violet-400"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div variants={fadeInUp}>
          <CompletionChart />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <CategoryDonut />
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div variants={fadeInUp}>
          <OnTimeChart />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <ActivityHeatmap />
        </motion.div>
      </div>
    </motion.div>
  );
}
