"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Timer,
  Coffee,
  Sparkles,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

type TimerMode = "focus" | "break" | "longBreak";

interface FocusTimerProps {
  taskTitle?: string;
  taskCategory?: string;
  onSessionComplete?: (mode: TimerMode, durationMinutes: number) => void;
  className?: string;
}

const modeConfig: Record<
  TimerMode,
  { label: string; duration: number; color: string; icon: React.ElementType }
> = {
  focus: {
    label: "Focus",
    duration: 25 * 60,
    color: "text-primary",
    icon: Timer,
  },
  break: {
    label: "Break",
    duration: 5 * 60,
    color: "text-emerald-400",
    icon: Coffee,
  },
  longBreak: {
    label: "Long Break",
    duration: 15 * 60,
    color: "text-violet-400",
    icon: Coffee,
  },
};

// ============================================================
// Component
// ============================================================

export function FocusTimer({
  taskTitle,
  taskCategory,
  onSessionComplete,
  className,
}: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(modeConfig.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const config = modeConfig[mode];
  const totalDuration = config.duration;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  // Timer tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // Session complete
  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);

      if (mode === "focus") {
        const newCount = sessionCount + 1;
        setSessionCount(newCount);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        onSessionComplete?.(mode, config.duration / 60);

        // Auto-switch to break
        if (newCount % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("break");
        }
      } else {
        // Break complete → back to focus
        switchMode("focus");
      }
    }
  }, [timeLeft, isRunning]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(modeConfig[newMode].duration);
    setIsRunning(false);
  }, []);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(config.duration);
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === "focus") {
      switchMode(sessionCount % 4 === 3 ? "longBreak" : "break");
    } else {
      switchMode("focus");
    }
  };

  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Circle SVG dimensions
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div variants={fadeInUp} className={cn("w-full max-w-sm mx-auto", className)}>
      <Card className="border-border/50 overflow-hidden relative">
        {/* Confetti effect */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="text-5xl animate-bounce">🎉</div>
              <Sparkles className="absolute top-4 left-8 w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute top-8 right-10 w-5 h-5 text-primary animate-pulse delay-150" />
              <Sparkles className="absolute bottom-12 left-12 w-4 h-4 text-emerald-400 animate-pulse delay-300" />
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="flex flex-col items-center py-8 px-6 space-y-6">
          {/* Current task */}
          {taskTitle && (
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Working on
              </p>
              <p className="text-sm font-medium text-foreground">{taskTitle}</p>
              {taskCategory && (
                <Badge variant="outline" className="text-[10px]">
                  {taskCategory}
                </Badge>
              )}
            </div>
          )}

          {/* Timer circle */}
          <div className="relative w-52 h-52">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-muted/20"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="currentColor"
                className={cn("transition-all duration-1000", config.color)}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tracking-tight text-foreground font-mono">
                {timeDisplay}
              </span>
              <span className={cn("text-xs font-medium mt-1", config.color)}>
                {config.label}
              </span>
            </div>
          </div>

          {/* Session info */}
          <p className="text-xs text-muted-foreground">
            Session {sessionCount + 1} of 4
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={resetTimer}
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className={cn(
                "h-14 w-14 rounded-full shadow-lg",
                isRunning
                  ? "bg-muted hover:bg-muted/80 text-foreground shadow-none"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/30"
              )}
              onClick={toggleTimer}
              aria-label={isRunning ? "Pause" : "Start"}
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={skipSession}
              aria-label="Skip"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Mode switcher */}
          <div className="flex gap-1 bg-muted/30 rounded-full p-1 border border-border/50">
            {(["focus", "break", "longBreak"] as const).map((m) => {
              const Icon = modeConfig[m].icon;
              return (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer",
                    mode === m
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {modeConfig[m].label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
