"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { Search, Bell, Sparkles, Menu } from "lucide-react";

interface TopNavbarProps {
  unreadCount?: number;
  onGenerateSchedule?: () => void;
}

export function TopNavbar({
  unreadCount = 0,
  onGenerateSchedule,
}: TopNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center gap-4 px-6 py-3",
        "bg-background/80 backdrop-blur-xl",
        "border-b border-border/50"
      )}
    >
      {/* Mobile hamburger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search tasks, projects..."
          className={cn(
            "pl-9 h-9 bg-muted/40 border-border/50",
            "focus-visible:bg-muted/60 focus-visible:ring-primary/30",
            "rounded-full text-sm"
          )}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Generate Schedule CTA */}
        <Button
          onClick={onGenerateSchedule}
          size="sm"
          className={cn(
            "hidden sm:inline-flex items-center gap-2",
            "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground",
            "shadow-md shadow-primary/20"
          )}
        >
          <Sparkles className="w-4 h-4" />
          Generate Schedule
        </Button>

        {/* Notifications */}
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
      </div>
    </header>
  );
}
