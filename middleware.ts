import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

// Export the Clerk middleware with minimal configuration
export default clerkMiddleware();

// Define the matcher to ensure middleware only runs where needed
export const config = {
  matcher: [
    // Only apply middleware to these routes, skipping some API routes
    // which could cause issues during build
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/data",
    "/api/dashboard/(.*)",
    "/api/reports/(.*)",
  ],
}