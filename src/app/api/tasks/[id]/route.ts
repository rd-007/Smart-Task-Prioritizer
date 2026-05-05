import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/[id]
 * Fetch a single task by ID. Verifies ownership.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task || task.userId !== user!.id) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ task });
}

/**
 * PATCH /api/tasks/[id]
 * Update a task. Handles completion logic and reschedule tracking.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const { id } = await params;

  // Verify ownership
  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask || existingTask.userId !== user!.id) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  const body = await req.json();

  // Build update data
  const updateData: Record<string, unknown> = {};

  if (body.title !== undefined) updateData.title = body.title.trim();
  if (body.description !== undefined) updateData.description = body.description;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.energyLevel !== undefined) updateData.energyLevel = body.energyLevel;
  if (body.estimatedDuration !== undefined) updateData.estimatedDuration = body.estimatedDuration;
  if (body.priorityScore !== undefined) updateData.priorityScore = body.priorityScore;

  // Handle status change to DONE
  if (body.status !== undefined) {
    updateData.status = body.status;

    if (body.status === "DONE" && existingTask.status !== "DONE") {
      updateData.completedAt = new Date();

      // Calculate actual duration if created time exists
      if (existingTask.createdAt) {
        const durationMs = Date.now() - existingTask.createdAt.getTime();
        updateData.actualDuration = Math.round(durationMs / 60000); // minutes
      }
    }

    // If un-completing a task
    if (body.status !== "DONE" && existingTask.status === "DONE") {
      updateData.completedAt = null;
      updateData.actualDuration = null;
    }
  }

  // Handle deadline change → increment rescheduledCount
  if (body.deadline !== undefined) {
    const newDeadline = body.deadline ? new Date(body.deadline) : null;
    updateData.deadline = newDeadline;

    if (
      existingTask.deadline &&
      newDeadline &&
      existingTask.deadline.getTime() !== newDeadline.getTime()
    ) {
      updateData.rescheduledCount = existingTask.rescheduledCount + 1;
    }
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ task });
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task and its linked schedule blocks.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const { id } = await params;

  // Verify ownership
  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask || existingTask.userId !== user!.id) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  // Delete task (schedule blocks FK will be set to null via onDelete: SetNull)
  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
