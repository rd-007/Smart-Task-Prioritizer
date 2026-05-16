"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  BrainCircuit,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  Check,
  CheckCheck,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

interface Notification {
  id: string;
  type: "AI_PRIORITY" | "SCHEDULE" | "PROCRASTINATION" | "BURNOUT" | "SUMMARY";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const typeConfig = {
  AI_PRIORITY: { icon: BrainCircuit, color: "text-primary", bg: "bg-primary/10" },
  SCHEDULE: { icon: CalendarCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  PROCRASTINATION: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  BURNOUT: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  SUMMARY: { icon: Sparkles, color: "text-violet-400", bg: "bg-violet-500/10" },
};

// ============================================================
// Mock data
// ============================================================

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "AI_PRIORITY",
    title: "Priority Updated",
    message: '"Review Pull Requests" moved to #1 — deadline approaching.',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "2",
    type: "PROCRASTINATION",
    title: "Nudge",
    message: '"Update Portfolio" has been delayed 4 times. Try the 15-min rule.',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "3",
    type: "SCHEDULE",
    title: "Schedule Ready",
    message: "Your AI schedule for today is ready. 5 tasks, 4h 15m.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "4",
    type: "SUMMARY",
    title: "Daily Briefing",
    message: "Good morning! You have 8 tasks today. Best window: 10 AM – 1 PM.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "5",
    type: "BURNOUT",
    title: "Burnout Warning",
    message: "You had 3 consecutive heavy days. Consider a lighter schedule.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

// ============================================================
// Helpers
// ============================================================

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ============================================================
// Component
// ============================================================

interface NotificationsPanelProps {
  trigger?: React.ReactNode;
}

export function NotificationsPanel({ trigger }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className={cn(
                  "absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1",
                  "flex items-center justify-center text-[10px] font-bold",
                  "rounded-full border-2 border-background"
                )}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[420px] p-0">
        <SheetHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1.5 h-7 rounded-full"
                onClick={markAllRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <Separator />

        <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-3 px-5 py-3.5 border-b border-border/30",
                      "hover:bg-muted/30 transition-colors cursor-pointer",
                      !notification.read && "bg-primary/[0.03]"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        config.bg
                      )}
                    >
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            notification.read
                              ? "text-muted-foreground"
                              : "text-foreground"
                          )}
                        >
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-xs leading-relaxed",
                          notification.read
                            ? "text-muted-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
