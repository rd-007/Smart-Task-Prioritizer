"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Realtime subscription hook.
 * Install: npm i @supabase/supabase-js (if not already)
 *
 * Usage:
 *   useRealtime("Task", { filter: `userId=eq.${userId}` }, (payload) => {
 *     // Handle INSERT, UPDATE, DELETE events
 *   });
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Singleton client for realtime
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE";

interface RealtimePayload<T = Record<string, unknown>> {
  eventType: RealtimeEvent;
  new: T;
  old: T;
}

interface UseRealtimeOptions {
  filter?: string;
  events?: RealtimeEvent[];
  enabled?: boolean;
}

export function useRealtime<T = Record<string, unknown>>(
  table: string,
  options: UseRealtimeOptions,
  onEvent: (payload: RealtimePayload<T>) => void
) {
  const { filter, events = ["INSERT", "UPDATE", "DELETE"], enabled = true } = options;

  const stableOnEvent = useCallback(onEvent, []);

  useEffect(() => {
    if (!enabled) return;

    const client = getSupabase();
    if (!client) return;

    const channelName = `realtime-${table}-${filter || "all"}`;

    const channel = client.channel(channelName);

    // Subscribe to each event type
    events.forEach((event) => {
      channel.on(
        "postgres_changes" as any,
        {
          event,
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        (payload: any) => {
          stableOnEvent({
            eventType: event,
            new: payload.new as T,
            old: payload.old as T,
          });
        }
      );
    });

    channel.subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [table, filter, enabled, stableOnEvent]);
}

/**
 * Pre-configured hook for Task table changes.
 */
export function useTaskRealtime(
  userId: string,
  onEvent: (payload: RealtimePayload) => void
) {
  return useRealtime("Task", { filter: `userId=eq.${userId}` }, onEvent);
}

/**
 * Pre-configured hook for Notification table changes.
 */
export function useNotificationRealtime(
  userId: string,
  onEvent: (payload: RealtimePayload) => void
) {
  return useRealtime("Notification", { filter: `userId=eq.${userId}` }, onEvent);
}
