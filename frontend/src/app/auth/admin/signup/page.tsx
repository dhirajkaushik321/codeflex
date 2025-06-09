'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/AuthForm';

export default function AdminSignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to register
      console.log('Admin signup:', data);
      
      // Redirect to admin dashboard
      router.push('/dashboard/admin');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="signup"
      userType="admin"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
} 