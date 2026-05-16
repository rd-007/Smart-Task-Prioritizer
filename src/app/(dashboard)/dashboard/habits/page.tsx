"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Clock,
  Zap,
  TrendingUp,
  Brain,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react";

// ============================================================
// Mock habits data (from /learn-habits endpoint)
// ============================================================

const productiveHours = { start: "10:00 AM", end: "1:00 PM" };
const avgCompletionSpeed = 1.2; // hours
const focusSessions = 42;

const hourlyProductivity = [
  { hour: "8a", value: 15 },
  { hour: "9a", value: 35 },
  { hour: "10a", value: 72 },
  { hour: "11a", value: 88 },
  { hour: "12p", value: 80 },
  { hour: "1p", value: 65 },
  { hour: "2p", value: 45 },
  { hour: "3p", value: 50 },
  { hour: "4p", value: 38 },
  { hour: "5p", value: 25 },
  { hour: "6p", value: 12 },
];

const delayPatterns = [
  { category: "Work", avgDelay: 0.8, dot: "bg-indigo-400" },
  { category: "Study", avgDelay: 2.1, dot: "bg-violet-400" },
  { category: "Personal", avgDelay: 3.5, dot: "bg-emerald-400" },
];

const weeklyFocus = [
  { day: "Mon", minutes: 145 },
  { day: "Tue", minutes: 120 },
  { day: "Wed", minutes: 180 },
  { day: "Thu", minutes: 95 },
  { day: "Fri", minutes: 160 },
  { day: "Sat", minutes: 50 },
  { day: "Sun", minutes: 25 },
];

const insights = [
  { icon: Sun, text: "You're most productive between 10 AM and 1 PM. Schedule deep work here.", color: "text-amber-400" },
  { icon: Brain, text: "Study tasks get delayed 2.6x more than work tasks. Try the 2-minute rule.", color: "text-violet-400" },
  { icon: Zap, text: "Your average focus session lasts 28 minutes — right on the Pomodoro sweet spot.", color: "text-primary" },
  { icon: TrendingUp, text: "Completion speed has improved 15% over the last 2 weeks.", color: "text-emerald-400" },
];

// ============================================================
// Component
// ============================================================

export default function HabitsPage() {
  const maxHourly = Math.max(...hourlyProductivity.map((h) => h.value));
  const maxFocus = Math.max(...weeklyFocus.map((d) => d.minutes));
  const maxDelay = Math.max(...delayPatterns.map((d) => d.avgDelay));

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
          <Activity className="h-6 w-6 text-primary" />
          Habit Insights
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-discovered patterns from your task history
        </p>
      </motion.div>

      {/* Key metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <motion.div variants={fadeInUp}>
          <Card className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Peak Hours</p>
                  <p className="text-lg font-bold text-foreground">
                    {productiveHours.start} – {productiveHours.end}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Completion</p>
                  <p className="text-lg font-bold text-foreground">
                    {avgCompletionSpeed}h per task
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10">
                  <Brain className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Focus Sessions</p>
                  <p className="text-lg font-bold text-foreground">
                    {focusSessions} this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Hourly Productivity */}
      <motion.div variants={fadeInUp}>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sunrise className="h-4 w-4 text-amber-400" />
              Hourly Productivity
            </CardTitle>
            <Badge variant="outline" className="text-[10px] text-primary border-primary/20">
              Peak: 11 AM
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {hourlyProductivity.map((h) => {
                const heightPct = (h.value / maxHourly) * 100;
                const isPeak = h.value >= 70;
                return (
                  <div
                    key={h.hour}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.6, delay: 0.05 }}
                      className={cn(
                        "w-full rounded-t-md",
                        isPeak
                          ? "bg-gradient-to-t from-primary/80 to-primary/50"
                          : "bg-muted/40"
                      )}
                      style={{ minHeight: "4px" }}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {h.hour}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-primary/70" /> Peak hours
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-muted/40" /> Other
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row: Delay Patterns + Focus Trend */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Delay patterns */}
        <motion.div variants={fadeInUp}>
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delay Patterns by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {delayPatterns.map((d) => (
                <div key={d.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full", d.dot)} />
                      <span className="text-foreground">{d.category}</span>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {d.avgDelay} days avg delay
                    </span>
                  </div>
                  <Progress
                    value={(d.avgDelay / maxDelay) * 100}
                    className="h-2"
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                Personal tasks have the longest average delay. Consider scheduling them right after high-energy work.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly focus trend */}
        <motion.div variants={fadeInUp}>
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Moon className="h-4 w-4 text-violet-400" />
                Weekly Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-32">
                {weeklyFocus.map((d) => {
                  const heightPct = (d.minutes / maxFocus) * 100;
                  return (
                    <div
                      key={d.day}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] text-muted-foreground">
                        {d.minutes}m
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.6 }}
                        className="w-full rounded-t-md bg-gradient-to-t from-violet-500/60 to-violet-400/30"
                        style={{ minHeight: "4px" }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Total: {weeklyFocus.reduce((s, d) => s + d.minutes, 0)} minutes ({(weeklyFocus.reduce((s, d) => s + d.minutes, 0) / 60).toFixed(1)}h)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div variants={fadeInUp}>
        <Card className="border-border/50 bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Habit Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", insight.color)} />
                  <span>{insight.text}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
