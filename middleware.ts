import { clerkMiddleware, ClerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  debug: true,
  // Add debug mode to help diagnose issues
} as any);

export const config = {
  matcher: [
    // Only apply middleware to these routes, skipping API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}