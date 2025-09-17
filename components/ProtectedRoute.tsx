'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait until Clerk loads the authentication state
    if (isLoaded && !isSignedIn) {
      // If not signed in, redirect to sign-in page
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading spinner while checking authentication
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Checking authentication...</h3>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}