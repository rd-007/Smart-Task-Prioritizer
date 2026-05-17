import type { Metadata } from "next";

/**
 * Shared metadata builder for dashboard pages.
 */
export function dashboardMeta(
  title: string,
  description: string
): Metadata {
  const fullTitle = `${title} | Smart Task Prioritizer`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
    },
  };
}

// Per-page metadata exports
export const dashboardMetadata = dashboardMeta(
  "Dashboard",
  "AI-powered productivity dashboard — see your priority queue, schedule, and focus insights at a glance."
);

export const todayMetadata = dashboardMeta(
  "Today's Plan",
  "Your AI-ranked task list for today, sorted by urgency and importance."
);

export const tasksMetadata = dashboardMeta(
  "All Tasks",
  "View, filter, and manage all your tasks in one place."
);

export const calendarMetadata = dashboardMeta(
  "Smart Schedule",
  "AI-generated daily schedule with energy-aware time blocking."
);

export const prioritiesMetadata = dashboardMeta(
  "AI Priorities",
  "See what AI recommends you work on next, with reasoning and confidence scores."
);

export const analyticsMetadata = dashboardMeta(
  "Analytics",
  "Track your productivity trends — completion rates, focus time, and habit patterns."
);

export const habitsMetadata = dashboardMeta(
  "Habit Insights",
  "AI-discovered productivity patterns from your task completion history."
);

export const settingsMetadata = dashboardMeta(
  "Settings",
  "Customize your profile, work preferences, appearance, and notifications."
);
