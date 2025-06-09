'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSigninPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the auth selection page
    router.push('/auth');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center pt-24">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Redirecting...</p>
      </div>
    </div>
  );
} 