"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  User,
  Clock,
  Palette,
  Bell,
  ChevronDown,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Component
// ============================================================

const timezones = [
  "Asia/Kolkata (GMT+5:30)",
  "America/New_York (GMT-5:00)",
  "America/Los_Angeles (GMT-8:00)",
  "Europe/London (GMT+0:00)",
  "Europe/Berlin (GMT+1:00)",
  "Asia/Tokyo (GMT+9:00)",
  "Australia/Sydney (GMT+11:00)",
];

const accentColors = [
  { name: "Indigo", value: "#6366F1", class: "bg-indigo-500" },
  { name: "Violet", value: "#8B5CF6", class: "bg-violet-500" },
  { name: "Emerald", value: "#10B981", class: "bg-emerald-500" },
  { name: "Amber", value: "#F59E0B", class: "bg-amber-500" },
  { name: "Rose", value: "#F43F5E", class: "bg-rose-500" },
];

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: "Rajit",
    email: "rajit@example.com",
    timezone: "Asia/Kolkata (GMT+5:30)",
    workStart: "09:00",
    workEnd: "18:00",
    breakDuration: 15,
    focusDuration: 25,
    accentColor: "#6366F1",
    notifications: {
      procrastination: true,
      burnout: true,
      dailySummary: true,
      scheduleReminders: false,
    },
  });

  const updateField = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateNotification = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your experience
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div variants={fadeInUp}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-muted-foreground uppercase tracking-wider">
                Name
              </Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="rounded-xl bg-muted/40 border-border/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Email
              </Label>
              <Input
                value={settings.email}
                disabled
                className="rounded-xl bg-muted/20 border-border/30 text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Timezone
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl bg-muted/40 border-border/50"
                  >
                    {settings.timezone}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                  {timezones.map((tz) => (
                    <DropdownMenuItem
                      key={tz}
                      onClick={() => updateField("timezone", tz)}
                      className={cn(settings.timezone === tz && "bg-accent")}
                    >
                      {tz}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Work Preferences */}
      <motion.div variants={fadeInUp}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Work Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="work-start" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Work Start
                </Label>
                <Input
                  id="work-start"
                  type="time"
                  value={settings.workStart}
                  onChange={(e) => updateField("workStart", e.target.value)}
                  className="rounded-xl bg-muted/40 border-border/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="work-end" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Work End
                </Label>
                <Input
                  id="work-end"
                  type="time"
                  value={settings.workEnd}
                  onChange={(e) => updateField("workEnd", e.target.value)}
                  className="rounded-xl bg-muted/40 border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="break-dur" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Break Duration
                </Label>
                <div className="relative">
                  <Input
                    id="break-dur"
                    type="number"
                    min={5}
                    max={30}
                    value={settings.breakDuration}
                    onChange={(e) =>
                      updateField("breakDuration", parseInt(e.target.value) || 15)
                    }
                    className="rounded-xl bg-muted/40 border-border/50 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="focus-dur" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Focus Duration
                </Label>
                <div className="relative">
                  <Input
                    id="focus-dur"
                    type="number"
                    min={15}
                    max={60}
                    value={settings.focusDuration}
                    onChange={(e) =>
                      updateField("focusDuration", parseInt(e.target.value) || 25)
                    }
                    className="rounded-xl bg-muted/40 border-border/50 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={fadeInUp}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>

            <Separator className="opacity-50" />

            <div>
              <p className="text-sm text-foreground mb-3">Accent Color</p>
              <div className="flex gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateField("accentColor", color.value)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all cursor-pointer",
                      color.class,
                      settings.accentColor === color.value
                        ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                        : "opacity-60 hover:opacity-100"
                    )}
                    title={color.name}
                    aria-label={`${color.name} accent color`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fadeInUp}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "procrastination",
                label: "Procrastination Nudges",
                desc: "Get reminders for delayed tasks",
              },
              {
                key: "burnout",
                label: "Burnout Warnings",
                desc: "Alerts when workload is too high",
              },
              {
                key: "dailySummary",
                label: "Daily Summary",
                desc: "Morning briefing with AI insights",
              },
              {
                key: "scheduleReminders",
                label: "Schedule Reminders",
                desc: "Notifications before scheduled blocks",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={
                    settings.notifications[
                      item.key as keyof typeof settings.notifications
                    ]
                  }
                  onCheckedChange={(v) => updateNotification(item.key, v)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <motion.div variants={fadeInUp} className="flex justify-end pb-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full gap-2 shadow-md shadow-primary/20 px-8"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
