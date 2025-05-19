import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard"]);

export default clerkMiddleware(
  async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
    const { sessionClaims } = await auth();

    // Restrict admin routes to users with specific permissions
    if (isProtectedRoute(req) && sessionClaims?.metadata.role !== "admin") {
      return NextResponse.json(
        "Unauthorization! Your account dont have permission",
      );
    }
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
