'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import EnhancedProfileForm from './EnhancedProfileForm';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

type OnboardingStep = 'welcome' | 'manual' | 'complete';

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');

  const handleManualComplete = (data: any) => {
    // Handle profile creation
    console.log('Profile created:', data);
    setCurrentStep('complete');
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-[#7ef9c0] to-[#a259f7] rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to CodeFlex!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Let's create your developer profile to unlock amazing opportunities
              </p>
            </div>

            <div className="bg-white dark:bg-[#23243a] rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Create Your Profile
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Fill out your profile with detailed information to showcase your skills and experience.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep('manual')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <User className="w-6 h-6" />
                  <span>Start Creating Profile</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </motion.button>

              <div className="mt-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>5-10 minutes</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete control</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Detailed information</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onSkip}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                I'll do this later
              </button>
            </div>
          </motion.div>
        );

      case 'manual':
        return (
          <EnhancedProfileForm
            onSave={handleManualComplete}
            onCancel={() => setCurrentStep('welcome')}
            isEditing={false}
          />
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Profile Created Successfully!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your developer profile is now ready. You can always edit it later from your dashboard.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                What's Next?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Explore job opportunities and projects
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Connect with other developers
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Get personalized recommendations
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => setCurrentStep('manual')}
                className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
} 