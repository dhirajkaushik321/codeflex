'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DeveloperSignupForm from '../../components/DeveloperSignupForm';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SignupPage() {
  const router = useRouter();

  const handleFormCompletion = () => {
    // Redirect to dashboard after form completion
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <DeveloperSignupForm onComplete={handleFormCompletion} />
      <Footer />
    </div>
  );
} 