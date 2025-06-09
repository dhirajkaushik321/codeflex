'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import DeveloperSignupForm from '../../components/DeveloperSignupForm';
import ProfileFormTransition from '../../components/ProfileFormTransition';
import Footer from '../../components/Footer';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTransition, setShowTransition] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', role: 'developer' });

  useEffect(() => {
    // Check if user is coming from auth form
    const fromAuth = searchParams.get('fromAuth');
    const userName = searchParams.get('userName');
    const userRole = searchParams.get('userRole');

    if (fromAuth === 'true' && userName) {
      setUserInfo({ name: userName, role: userRole || 'developer' });
      setShowTransition(true);
    } else {
      setShowForm(true);
    }
  }, [searchParams]);

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setShowForm(true);
  };

  const handleFormCompletion = () => {
    // Show success message and redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatePresence mode="wait">
        {showTransition && (
          <ProfileFormTransition
            isVisible={showTransition}
            onComplete={handleTransitionComplete}
            userName={userInfo.name}
            userRole={userInfo.role}
          />
        )}
        
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DeveloperSignupForm onComplete={handleFormCompletion} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
} 