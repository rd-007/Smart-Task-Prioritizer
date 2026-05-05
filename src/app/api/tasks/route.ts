import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { TaskStatus, TaskCategory, Prisma } from "@prisma/client";

/**
 * GET /api/tasks
 * Fetch all tasks for the authenticated user.
 * Query params: ?status=TODO&category=WORK&sort=priorityScore&order=desc
 */
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status") as TaskStatus | null;
  const category = searchParams.get("category") as TaskCategory | null;
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  // Build filter
  const where: Prisma.TaskWhereInput = {
    userId: user!.id,
    ...(status && { status }),
    ...(category && { category }),
  };

  // Build sort
  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [sort]: order as Prisma.SortOrder,
  };

  const tasks = await prisma.task.findMany({
    where,
    orderBy,
  });

  return NextResponse.json({ tasks });
}

/**
 * POST /api/tasks
 * Create a new task for the authenticated user.
 */
export async function POST(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const body = await req.json();

  // Validate required fields
  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      userId: user!.id,
      title: body.title.trim(),
      description: body.description || null,
      category: body.category || "PERSONAL",
      priority: body.priority || "MEDIUM",
      deadline: body.deadline ? new Date(body.deadline) : null,
      estimatedDuration: body.estimatedDuration || null,
      energyLevel: body.energyLevel || "MEDIUM",
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
