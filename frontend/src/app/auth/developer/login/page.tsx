'use client';
import { Suspense } from 'react';
import UnifiedAuthForm from '@/components/UnifiedAuthForm';

export default function DeveloperLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <UnifiedAuthForm />
    </Suspense>
  );
} 