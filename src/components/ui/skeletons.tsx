"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic dashboard page skeleton with stat cards and content area.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Task list skeleton — shows multiple task card placeholders.
 */
export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 rounded-2xl border border-border/50 bg-card"
        >
          <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * Schedule timeline skeleton.
 */
export function ScheduleSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 animate-in fade-in duration-300">
      <div className="flex gap-4" style={{ height: "500px" }}>
        <div className="w-16 space-y-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-12 ml-auto" />
          ))}
        </div>
        <div className="flex-1 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full rounded-xl"
              style={{ height: `${40 + Math.random() * 60}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
