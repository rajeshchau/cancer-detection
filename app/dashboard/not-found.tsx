'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">
        The dashboard you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}