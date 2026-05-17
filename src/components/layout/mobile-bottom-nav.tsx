"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ListTodo,
  Plus,
  Calendar,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/dashboard/today", icon: Plus, label: "Add", isCenter: true },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "bg-card/95 backdrop-blur-xl border-t border-border/50",
        "safe-bottom"
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center",
                  "w-12 h-12 -mt-5 rounded-full",
                  "bg-primary text-primary-foreground",
                  "shadow-lg shadow-primary/30",
                  "transition-transform active:scale-95"
                )}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5",
                "transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
