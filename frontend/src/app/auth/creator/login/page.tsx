'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/AuthForm';

export default function CreatorLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to authenticate
      console.log('Creator login:', data);
      
      // Redirect to creator dashboard
      router.push('/dashboard/creator');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="login"
      userType="creator"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
} 