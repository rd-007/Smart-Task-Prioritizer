"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ScheduleBlock {
  id: string;
  taskId: string | null;
  title?: string;
  startTime: string;
  endTime: string;
  type: "DEEP_WORK" | "MEETING" | "BREAK" | "PERSONAL";
  task?: {
    id: string;
    title: string;
    category: string;
    priority: string;
  } | null;
}

interface ScheduleData {
  blocks: ScheduleBlock[];
  date: string;
  source?: "ai" | "fallback";
}

/**
 * Hook for schedule management — fetch, generate, and create blocks.
 */
export function useSchedule() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [source, setSource] = useState<string>("");

  // Fetch schedule for a date
  const fetchSchedule = useCallback(async (date?: string) => {
    setLoading(true);
    try {
      const query = date ? `?date=${date}` : "";
      const response = await fetch(`/api/schedule${query}`);
      if (!response.ok) throw new Error("Failed to fetch schedule");

      const data: ScheduleData = await response.json();
      setBlocks(data.blocks);
      return data;
    } catch (error) {
      toast.error("Failed to load schedule");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate AI schedule
  const generateSchedule = useCallback(async (date?: string) => {
    setGenerating(true);
    try {
      const response = await fetch("/api/schedule/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date || new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) throw new Error("Failed to generate schedule");

      const data: ScheduleData = await response.json();
      setBlocks(data.blocks);
      setSource(data.source || "ai");

      const blockCount = data.blocks.filter(
        (b: ScheduleBlock) => b.type !== "BREAK"
      ).length;

      toast.success("Schedule generated! ✨", {
        description: `${blockCount} tasks scheduled via ${data.source === "ai" ? "AI" : "smart fallback"}`,
      });

      return data;
    } catch (error) {
      toast.error("Failed to generate schedule", {
        description: "Please try again or check if the AI service is running.",
      });
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  // Create a manual block
  const createBlock = useCallback(
    async (block: {
      date: string;
      startTime: string;
      endTime: string;
      type?: string;
      taskId?: string;
    }) => {
      try {
        const response = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(block),
        });

        if (!response.ok) throw new Error("Failed to create block");

        const { block: newBlock } = await response.json();
        setBlocks((prev) =>
          [...prev, newBlock].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          )
        );

        toast.success("Block added");
        return newBlock;
      } catch (error) {
        toast.error("Failed to add block");
        return null;
      }
    },
    []
  );

  return {
    blocks,
    setBlocks,
    loading,
    generating,
    source,
    fetchSchedule,
    generateSchedule,
    createBlock,
  };
}
