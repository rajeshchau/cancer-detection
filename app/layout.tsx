import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cancer Report Classifier - AI-Powered Medical Analysis',
  description: 'Upload your medical PDF report and instantly check if it mentions cancer using advanced AI technology.',
};

// Check if Clerk API keys are properly configured
const isClerkConfigured = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH_YOUR');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Clerk is not configured, render the app without ClerkProvider
  if (!isClerkConfigured) {
    return (
      <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <div className="bg-yellow-100 p-4 text-yellow-800 text-center">
            <p className="font-semibold">⚠️ Clerk API keys not configured. Authentication is disabled.</p>
            <p className="text-sm">Please update your .env.local file with valid Clerk API keys.</p>
          </div>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}