import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Get the authenticated user from Clerk + our database.
 * Returns the Prisma User record or a 401 response.
 */
export async function getAuthenticatedUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      ),
    };
  }

  return { user, error: null };
}
