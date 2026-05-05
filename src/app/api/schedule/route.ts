import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

/**
 * GET /api/schedule
 * Return schedule blocks for a given date (default: today).
 * Query params: ?date=2026-05-06
 */
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const searchParams = req.nextUrl.searchParams;
  const dateParam = searchParams.get("date");

  // Parse date or use today
  const targetDate = dateParam ? new Date(dateParam) : new Date();
  // Normalize to start of day
  targetDate.setHours(0, 0, 0, 0);

  const blocks = await prisma.scheduleBlock.findMany({
    where: {
      userId: user!.id,
      date: targetDate,
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          category: true,
          priority: true,
          status: true,
          energyLevel: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return NextResponse.json({ blocks, date: targetDate.toISOString() });
}

/**
 * POST /api/schedule
 * Manually create a schedule block (for custom events / breaks).
 */
export async function POST(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const body = await req.json();

  // Validate required fields
  if (!body.date || !body.startTime || !body.endTime) {
    return NextResponse.json(
      { error: "date, startTime, and endTime are required" },
      { status: 400 }
    );
  }

  // Validate time format (HH:mm)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(body.startTime) || !timeRegex.test(body.endTime)) {
    return NextResponse.json(
      { error: "startTime and endTime must be in HH:mm format" },
      { status: 400 }
    );
  }

  // Validate startTime < endTime
  if (body.startTime >= body.endTime) {
    return NextResponse.json(
      { error: "startTime must be before endTime" },
      { status: 400 }
    );
  }

  const date = new Date(body.date);
  date.setHours(0, 0, 0, 0);

  const block = await prisma.scheduleBlock.create({
    data: {
      userId: user!.id,
      taskId: body.taskId || null,
      date,
      startTime: body.startTime,
      endTime: body.endTime,
      type: body.type || "DEEP_WORK",
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
  });

  return NextResponse.json({ block }, { status: 201 });
}
