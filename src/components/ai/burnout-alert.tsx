"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, Heart, Minus } from "lucide-react";

interface BurnoutAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskLevel: "none" | "low" | "medium" | "high";
  riskScore: number;
  message: string;
  suggestions: string[];
  scheduledHours: number;
  onReduceLoad?: () => void;
}

const riskStyles = {
  none: { border: "border-emerald-500/20", glow: "bg-emerald-500/5", color: "text-emerald-400" },
  low: { border: "border-amber-500/20", glow: "bg-amber-500/5", color: "text-amber-400" },
  medium: { border: "border-orange-500/20", glow: "bg-orange-500/5", color: "text-orange-400" },
  high: { border: "border-red-500/20", glow: "bg-red-500/5", color: "text-red-400" },
};

const riskEmoji = {
  none: "🟢",
  low: "🟡",
  medium: "🟠",
  high: "🔴",
};

export function BurnoutAlert({
  open,
  onOpenChange,
  riskLevel,
  riskScore,
  message,
  suggestions,
  scheduledHours,
  onReduceLoad,
}: BurnoutAlertProps) {
  const styles = riskStyles[riskLevel];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-md rounded-3xl border-2 p-0 overflow-hidden",
          styles.border
        )}
      >
        {/* Glow backdrop */}
        <div
          className={cn(
            "absolute inset-0 opacity-30 pointer-events-none",
            styles.glow
          )}
        />

        <DialogHeader className="relative px-6 pt-6 pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-muted/50 border border-border/50"
              )}
            >
              {riskLevel === "high" ? (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              ) : (
                <Heart className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg">
                {riskEmoji[riskLevel]} Burnout Risk{" "}
                {riskLevel === "high" ? "Detected" : "Check"}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Based on your current workload
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative px-6 py-4 space-y-4">
          {/* Risk meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Risk Score</span>
              <span className={cn("font-semibold", styles.color)}>
                {riskScore}/100
              </span>
            </div>
            <Progress value={riskScore} className="h-2" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Healthy</span>
              <span>Overloaded</span>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-foreground/80">{message}</p>

          {/* Scheduled hours */}
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 text-sm">
            <span className="text-muted-foreground">Scheduled today</span>
            <span className={cn("font-semibold", scheduledHours > 8 ? "text-red-400" : "text-foreground")}>
              {scheduledHours.toFixed(1)} hours
            </span>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="space-y-2">
              {suggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <Minus className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="relative px-6 py-4 border-t border-border/30">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            I&apos;ll manage
          </Button>
          {riskLevel !== "none" && onReduceLoad && (
            <Button
              onClick={() => {
                onReduceLoad();
                onOpenChange(false);
              }}
              className="rounded-full gap-2 shadow-md shadow-primary/20"
            >
              Reduce Load
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
