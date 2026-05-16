"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Coffee,
  Loader2,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

// ============================================================
// Types
// ============================================================

interface ScheduleBlock {
  id: string;
  taskId: string | null;
  title: string;
  startTime: string; // HH:mm
  endTime: string;
  type: "DEEP_WORK" | "MEETING" | "BREAK" | "PERSONAL";
  category?: "WORK" | "STUDY" | "PERSONAL";
}

// ============================================================
// Mock data
// ============================================================

const mockBlocks: ScheduleBlock[] = [
  { id: "b1", taskId: "1", title: "Review Pull Requests", startTime: "09:00", endTime: "09:30", type: "DEEP_WORK", category: "WORK" },
  { id: "b2", taskId: null, title: "Break", startTime: "09:30", endTime: "09:45", type: "BREAK" },
  { id: "b3", taskId: "2", title: "Prepare Q2 Report", startTime: "09:45", endTime: "10:30", type: "DEEP_WORK", category: "WORK" },
  { id: "b4", taskId: null, title: "Break", startTime: "10:30", endTime: "10:45", type: "BREAK" },
  { id: "b5", taskId: "4", title: "Study ML Chapter 5", startTime: "10:45", endTime: "11:45", type: "DEEP_WORK", category: "STUDY" },
  { id: "b6", taskId: null, title: "Break", startTime: "11:45", endTime: "12:00", type: "BREAK" },
  { id: "b7", taskId: null, title: "Lunch", startTime: "12:00", endTime: "13:00", type: "BREAK" },
  { id: "b8", taskId: "5", title: "Update Portfolio", startTime: "13:00", endTime: "14:30", type: "DEEP_WORK", category: "PERSONAL" },
  { id: "b9", taskId: null, title: "Break", startTime: "14:30", endTime: "14:45", type: "BREAK" },
  { id: "b10", taskId: "6", title: "Buy Groceries", startTime: "14:45", endTime: "15:05", type: "PERSONAL", category: "PERSONAL" },
];

const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

// ============================================================
// Helpers
// ============================================================

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getBlockStyle(block: ScheduleBlock) {
  const startMin = timeToMinutes(block.startTime) - 8 * 60; // offset from 8 AM
  const endMin = timeToMinutes(block.endTime) - 8 * 60;
  const totalMin = 10 * 60; // 8AM - 6PM = 10 hours
  const top = (startMin / totalMin) * 100;
  const height = ((endMin - startMin) / totalMin) * 100;

  return { top: `${top}%`, height: `${height}%` };
}

const blockStyles: Record<string, string> = {
  DEEP_WORK: "bg-primary/15 border-primary/30 text-primary hover:bg-primary/20",
  MEETING: "bg-violet-500/15 border-violet-500/30 text-violet-400 hover:bg-violet-500/20",
  BREAK: "bg-muted/40 border-border/30 text-muted-foreground",
  PERSONAL: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20",
};

const categoryDots: Record<string, string> = {
  WORK: "bg-indigo-400",
  STUDY: "bg-violet-400",
  PERSONAL: "bg-emerald-400",
};

// ============================================================
// Component
// ============================================================

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [blocks, setBlocks] = useState(mockBlocks);
  const [generating, setGenerating] = useState(false);

  const workMinutes = blocks
    .filter((b) => b.type !== "BREAK")
    .reduce((sum, b) => sum + (timeToMinutes(b.endTime) - timeToMinutes(b.startTime)), 0);

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Smart Schedule
          </h1>
        </div>

        {/* Date nav + Generate */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/40 rounded-full border border-border/50 px-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedDate((d) => subDays(d, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3 min-w-[160px] text-center">
              {format(selectedDate, "EEEE, MMM d")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-full gap-2 shadow-md shadow-primary/20"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating ? "Generating..." : "Generate Schedule"}
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Timeline */}
        <motion.div variants={fadeInUp}>
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              {blocks.length === 0 ? (
                <EmptyState
                  variant="schedule"
                  onAction={handleGenerate}
                  className="py-20"
                />
              ) : (
                <div className="relative flex" style={{ height: "600px" }}>
                  {/* Hour labels */}
                  <div className="flex-shrink-0 w-16 border-r border-border/30">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="relative"
                        style={{ height: `${100 / hours.length}%` }}
                      >
                        <span className="absolute -top-2.5 right-3 text-[11px] text-muted-foreground font-mono">
                          {hour <= 12
                            ? `${hour}${hour === 12 ? " PM" : " AM"}`
                            : `${hour - 12} PM`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Blocks area */}
                  <div className="relative flex-1">
                    {/* Hour grid lines */}
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="absolute w-full border-t border-border/20"
                        style={{
                          top: `${((hour - 8) / 10) * 100}%`,
                        }}
                      />
                    ))}

                    {/* Schedule blocks */}
                    {blocks.map((block) => {
                      const style = getBlockStyle(block);
                      const durationMin =
                        timeToMinutes(block.endTime) -
                        timeToMinutes(block.startTime);

                      return (
                        <div
                          key={block.id}
                          className={cn(
                            "absolute left-2 right-2 rounded-xl border px-3 py-1.5",
                            "flex flex-col justify-center overflow-hidden",
                            "transition-all duration-150 cursor-pointer",
                            blockStyles[block.type]
                          )}
                          style={style}
                        >
                          <div className="flex items-center gap-1.5">
                            {block.type === "BREAK" ? (
                              <Coffee className="h-3 w-3 shrink-0" />
                            ) : block.category ? (
                              <span
                                className={cn(
                                  "w-2 h-2 rounded-full shrink-0",
                                  categoryDots[block.category]
                                )}
                              />
                            ) : null}
                            <span className="text-xs font-medium truncate">
                              {block.title}
                            </span>
                          </div>
                          {durationMin >= 30 && (
                            <span className="text-[10px] opacity-70 mt-0.5">
                              {block.startTime} – {block.endTime} ({durationMin}m)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar panel */}
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* Stats */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Schedule Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasks scheduled</span>
                <span className="font-medium text-foreground">
                  {blocks.filter((b) => b.type !== "BREAK").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total work time</span>
                <span className="font-medium text-foreground">
                  {Math.floor(workMinutes / 60)}h {workMinutes % 60}m
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Breaks</span>
                <span className="font-medium text-foreground">
                  {blocks.filter((b) => b.type === "BREAK").length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Unscheduled */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unscheduled Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-foreground text-xs">Write blog post</span>
                <Badge variant="outline" className="ml-auto text-[10px] h-5">120m</Badge>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-foreground text-xs">Fix CSS layout bug</span>
                <Badge variant="outline" className="ml-auto text-[10px] h-5">30m</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>✨ High-energy tasks scheduled during your peak hours (10–1 PM)</li>
                <li>☕ 4 breaks inserted for sustained focus</li>
                <li>⚡ 2 tasks couldn&apos;t fit — consider extending your work window</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
