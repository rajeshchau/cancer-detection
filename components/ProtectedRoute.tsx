'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Wait until Clerk loads the authentication state
    if (isLoaded && !isSignedIn && process.env.NODE_ENV !== 'production') {
      // Allow dev mode to continue without redirecting
      const storedDemoMode = localStorage.getItem('demoMode') === 'true';
      setDemoMode(storedDemoMode);
    } else if (isLoaded && !isSignedIn) {
      // If not signed in and not in dev mode, redirect to login page
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  const enableDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    setDemoMode(true);
  };

  // Show loading spinner while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Checking authentication...</h3>
        </div>
      </div>
    );
  }

  // Show demo mode option when not authenticated but in development
  if (!isSignedIn && !demoMode && process.env.NODE_ENV !== 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6 text-gray-600">
            You need to be signed in to view this page. Since you're in development mode, you can enable Demo Mode
            to view the application with sample data.
          </p>
          <div className="flex flex-col space-y-3">
            <Button onClick={() => router.push('/login')} className="w-full">
              Sign In
            </Button>
            <Button 
              onClick={enableDemoMode} 
              variant="outline" 
              className="w-full"
            >
              Continue in Demo Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated or in demo mode, render children
  return <>{children}</>;
}