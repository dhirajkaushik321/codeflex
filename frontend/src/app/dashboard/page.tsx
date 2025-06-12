'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      console.log('User role:', user.role); // Debug log
      
      // Redirect based on user role
      switch (user.role) {
        case 'developer':
          console.log('Redirecting to developer dashboard');
          router.push('/dashboard/developer');
          break;
        case 'creator':
          console.log('Redirecting to creator dashboard');
          router.push('/dashboard/creator');
          break;
        case 'admin':
          console.log('Redirecting to admin dashboard');
          router.push('/dashboard/admin');
          break;
        default:
          console.log('Unknown role, defaulting to developer dashboard');
          // Default to developer dashboard if role is unknown
          router.push('/dashboard/developer');
          break;
      }
    } else if (!isLoading && !user) {
      console.log('No user found, redirecting to auth');
      // Redirect to login if not authenticated
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // Show loading state while determining redirect
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // This should not be reached, but just in case
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to your dashboard...</p>
        {user && (
          <p className="text-sm text-gray-500 mt-2">
            User role: {user.role}
          </p>
        )}
      </div>
    </div>
  );
} 