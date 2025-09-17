'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

// Check if Clerk API keys are properly configured
const isClerkConfigured = 
  typeof process !== 'undefined' && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH_YOUR');

export default function Navbar() {
  const pathname = usePathname() || '/';
  
  // Use Clerk hooks only if configured
  const { isSignedIn, user, isLoaded } = isClerkConfigured ? useUser() : { isSignedIn: false, user: null, isLoaded: true };

  // Define navigation items
  let navItems = [
    { href: '/', label: 'Home' },
  ];
  
  // Add protected routes based on auth status or if Clerk is not configured
  if (!isClerkConfigured || isSignedIn) {
    navItems = [
      ...navItems,
      { href: '/upload', label: 'Upload' },
      { href: '/dashboard', label: 'Dashboard' },
    ];
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Cancer Classifier
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Auth buttons */}
              <div className="ml-4 flex items-center">
                {isClerkConfigured ? (
                  !isLoaded ? (
                    // Show loading state
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                  ) : isSignedIn ? (
                    // Show user button for signed in users
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    // Show sign in/up buttons for guests
                    <div className="flex space-x-2">
                      <SignInButton mode="modal">
                        <Button variant="outline" size="sm">Sign In</Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button size="sm">Sign Up</Button>
                      </SignUpButton>
                    </div>
                  )
                ) : (
                  // Show message when Clerk is not configured
                  <span className="text-sm text-yellow-600 font-medium px-3 py-1 bg-yellow-100 rounded-md">
                    Auth Disabled
                  </span>
                )}
              </div>
            </div>
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile auth buttons */}
          <div className="px-3 py-2 mt-4">
            {isClerkConfigured ? (
              !isLoaded ? (
                // Show loading state
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mx-auto"></div>
              ) : isSignedIn ? (
                // Show user button for signed in users
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                // Show sign in/up buttons for guests
                <div className="flex flex-col space-y-2">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full">Sign Up</Button>
                  </SignUpButton>
                </div>
              )
            ) : (
              // Show message when Clerk is not configured
              <div className="text-center">
                <span className="text-sm text-yellow-600 font-medium px-3 py-1 bg-yellow-100 rounded-md">
                  Auth Disabled
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}