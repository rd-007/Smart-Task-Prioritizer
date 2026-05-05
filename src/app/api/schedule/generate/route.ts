import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

/**
 * POST /api/schedule/generate
 * Trigger AI schedule generation for a given date.
 * Calls Python FastAPI /generate-schedule endpoint.
 * Saves returned blocks to DB.
 */
export async function POST(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const body = await req.json();
  const dateParam = body.date || new Date().toISOString().split("T")[0];
  const targetDate = new Date(dateParam);
  targetDate.setHours(0, 0, 0, 0);

  // Fetch incomplete tasks for the user
  const tasks = await prisma.task.findMany({
    where: {
      userId: user!.id,
      status: { not: "DONE" },
    },
    orderBy: {
      priorityScore: "desc",
    },
  });

  if (tasks.length === 0) {
    return NextResponse.json(
      { error: "No pending tasks to schedule" },
      { status: 400 }
    );
  }

  // Get user preferences
  const workStart = user!.preferredWorkStart || "09:00";
  const workEnd = user!.preferredWorkEnd || "17:00";
  const breakDuration = user!.breakDuration || 15;

  // Get existing habit data for energy patterns
  const recentHabits = await prisma.habitLog.findMany({
    where: { userId: user!.id },
    orderBy: { date: "desc" },
    take: 7,
  });

  // Call Python FastAPI AI service
  const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
  const aiApiKey = process.env.AI_SERVICE_API_KEY || "";

  try {
    const aiResponse = await fetch(`${aiServiceUrl}/generate-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": aiApiKey,
      },
      body: JSON.stringify({
        tasks: tasks.map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          priority: t.priority,
          priorityScore: t.priorityScore,
          estimatedDuration: t.estimatedDuration || 30,
          energyLevel: t.energyLevel,
          deadline: t.deadline?.toISOString() || null,
        })),
        userPreferences: {
          workStart,
          workEnd,
          breakDuration,
          timezone: user!.timezone,
        },
        habitData: recentHabits.map((h) => ({
          productiveHoursStart: h.productiveHoursStart,
          productiveHoursEnd: h.productiveHoursEnd,
          avgCompletionSpeed: h.avgCompletionSpeed,
        })),
        date: dateParam,
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!aiResponse.ok) {
      const aiError = await aiResponse.text();
      console.error("[Schedule Generate] AI service error:", aiError);

      // Fallback: generate a simple greedy schedule locally
      return await generateFallbackSchedule(
        user!.id,
        tasks,
        targetDate,
        workStart,
        workEnd,
        breakDuration
      );
    }

    const aiResult = await aiResponse.json();

    // Clear existing blocks for this date
    await prisma.scheduleBlock.deleteMany({
      where: {
        userId: user!.id,
        date: targetDate,
      },
    });

    // Save AI-generated blocks
    const blocks = await Promise.all(
      aiResult.blocks.map(
        (block: {
          taskId?: string;
          startTime: string;
          endTime: string;
          type?: string;
        }) =>
          prisma.scheduleBlock.create({
            data: {
              userId: user!.id,
              taskId: block.taskId || null,
              date: targetDate,
              startTime: block.startTime,
              endTime: block.endTime,
              type: (block.type as "DEEP_WORK" | "MEETING" | "BREAK" | "PERSONAL") || "DEEP_WORK",
            },
            include: {
              task: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                  priority: true,
                },
              },
            },
          })
      )
    );

    return NextResponse.json({
      blocks,
      date: targetDate.toISOString(),
      source: "ai",
    });
  } catch (err) {
    console.error("[Schedule Generate] Failed to reach AI service:", err);

    // Fallback to local greedy scheduling
    return await generateFallbackSchedule(
      user!.id,
      tasks,
      targetDate,
      workStart,
      workEnd,
      breakDuration
    );
  }
}

/**
 * Fallback: simple greedy schedule when AI service is unavailable.
 * Assigns tasks sequentially within work hours, inserting breaks.
 */
async function generateFallbackSchedule(
  userId: string,
  tasks: { id: string; title: string; estimatedDuration: number | null }[],
  targetDate: Date,
  workStart: string,
  workEnd: string,
  breakDuration: number
) {
  // Parse work hours to minutes
  const [startH, startM] = workStart.split(":").map(Number);
  const [endH, endM] = workEnd.split(":").map(Number);
  const workStartMins = startH * 60 + startM;
  const workEndMins = endH * 60 + endM;

  // Clear existing blocks
  await prisma.scheduleBlock.deleteMany({
    where: { userId, date: targetDate },
  });

  const blocks = [];
  let currentTime = workStartMins;

  for (const task of tasks) {
    const duration = task.estimatedDuration || 30;

    if (currentTime + duration > workEndMins) break;

    const startTime = `${String(Math.floor(currentTime / 60)).padStart(2, "0")}:${String(currentTime % 60).padStart(2, "0")}`;
    currentTime += duration;
    const endTime = `${String(Math.floor(currentTime / 60)).padStart(2, "0")}:${String(currentTime % 60).padStart(2, "0")}`;

    const block = await prisma.scheduleBlock.create({
      data: {
        userId,
        taskId: task.id,
        date: targetDate,
        startTime,
        endTime,
        type: "DEEP_WORK",
      },
      include: {
        task: {
          select: { id: true, title: true, category: true, priority: true },
        },
      },
    });
    blocks.push(block);

    // Add break
    currentTime += breakDuration;
  }

  return NextResponse.json({
    blocks,
    date: targetDate.toISOString(),
    source: "fallback",
  });
}
