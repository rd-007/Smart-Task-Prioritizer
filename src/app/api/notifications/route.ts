import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

/**
 * GET /api/notifications
 * List notifications for the authenticated user.
 * Query params: ?unreadOnly=true&limit=20
 */
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const searchParams = req.nextUrl.searchParams;
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user!.id,
      ...(unreadOnly && { read: false }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  const unreadCount = await prisma.notification.count({
    where: {
      userId: user!.id,
      read: false,
    },
  });

  return NextResponse.json({ notifications, unreadCount });
}

/**
 * PATCH /api/notifications
 * Mark notifications as read.
 * Body: { ids: string[] } or { markAllRead: true }
 */
export async function PATCH(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const body = await req.json();

  if (body.markAllRead) {
    // Mark all as read
    await prisma.notification.updateMany({
      where: {
        userId: user!.id,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ success: true, message: "All marked as read" });
  }

  if (body.ids && Array.isArray(body.ids)) {
    // Mark specific notifications as read
    await prisma.notification.updateMany({
      where: {
        id: { in: body.ids },
        userId: user!.id,
      },
      data: { read: true },
    });

    return NextResponse.json({
      success: true,
      message: `${body.ids.length} marked as read`,
    });
  }

  return NextResponse.json(
    { error: "Provide 'ids' array or 'markAllRead: true'" },
    { status: 400 }
  );
}
