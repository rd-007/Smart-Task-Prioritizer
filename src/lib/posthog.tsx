"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

/**
 * PostHog analytics provider.
 * Install: npm i posthog-js
 *
 * Tracks: page views, task events, schedule generation, focus sessions.
 */

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

    if (key) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage",
        // Respect user privacy
        opt_in_site_apps: false,
        disable_session_recording: process.env.NODE_ENV !== "production",
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// ============================================================
// Event tracking helpers
// ============================================================

export const analytics = {
  taskCreated: (props: { category: string; priority: string }) => {
    posthog.capture("task_created", props);
  },

  taskCompleted: (props: { taskId: string; category: string; durationMinutes: number }) => {
    posthog.capture("task_completed", props);
  },

  taskDeleted: (props: { taskId: string }) => {
    posthog.capture("task_deleted", props);
  },

  scheduleGenerated: (props: { taskCount: number; source: string }) => {
    posthog.capture("schedule_generated", props);
  },

  focusSessionStarted: (props: { taskTitle: string; durationMinutes: number }) => {
    posthog.capture("focus_session_started", props);
  },

  focusSessionCompleted: (props: { taskTitle: string; durationMinutes: number }) => {
    posthog.capture("focus_session_completed", props);
  },

  priorityViewed: () => {
    posthog.capture("priority_page_viewed");
  },

  burnoutAlertShown: (props: { riskLevel: string; riskScore: number }) => {
    posthog.capture("burnout_alert_shown", props);
  },

  themeChanged: (props: { theme: string }) => {
    posthog.capture("theme_changed", props);
  },
};
