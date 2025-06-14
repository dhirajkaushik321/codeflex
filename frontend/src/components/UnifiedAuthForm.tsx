'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiService, SignupData, LoginData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Notification from './Notification';
import SuccessCelebration from './SuccessCelebration';

type AuthMode = 'login' | 'signup';
type UserRole = 'developer' | 'creator' | 'admin';

interface AuthFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
}

const roleConfig = {
  developer: {
    title: 'Developer',
    subtitle: 'Practice, Learn & Prepare',
    icon: '💻',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
  },
  creator: {
    title: 'Content Creator',
    subtitle: 'Create & Share Knowledge',
    icon: '✍️',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
  },
  admin: {
    title: 'Admin',
    subtitle: 'Platform Management',
    icon: '⚙️',
    color: 'from-green-500 to-teal-600',
    bgColor: 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20'
  }
};

export default function UnifiedAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('developer');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    type: 'info',
    message: '',
    isVisible: false
  });
  
  const [formData, setFormData] = useState<AuthFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'developer'
  });

  // Set role from URL params
  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && roleConfig[roleParam]) {
      setSelectedRole(roleParam);
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const config = roleConfig[selectedRole];

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, isVisible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Validate signup data
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const signupData: SignupData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const response = await apiService.signup(signupData);
        
        // Use auth context to login
        login(response.access_token, response.user);
        
        // Show success celebration
        setShowSuccessCelebration(true);
        
        // Show success notification
        showNotification('success', `Welcome ${formData.firstName}! Your account has been created successfully.`);
        
        // Redirect to profile completion after celebration
        setTimeout(() => {
          if (!response.user?.isProfileComplete) {
            router.push(`/signup?fromAuth=true&userName=${encodeURIComponent(formData.firstName)}&userRole=${encodeURIComponent(formData.role)}`);
          } else {
            router.push('/dashboard');
          }
        }, 7000); // Increased from 4000 to 7000ms
      } else {
        // Login
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password,
        };

        const response = await apiService.login(loginData);
        
        // Use auth context to login
        login(response.access_token, response.user);
        
        // Show success notification for login
        showNotification('success', `Welcome back! Redirecting to your dashboard...`);
        
        // Redirect based on profile completion
        setTimeout(() => {
          if (response.user?.isProfileComplete) {
            router.push('/dashboard');
          } else {
            router.push('/signup');
          }
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (notification.isVisible) hideNotification();
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    console.log(`${provider} login clicked`);
    showNotification('info', `${provider} login coming soon!`);
  };

  const handleSuccessCelebrationComplete = () => {
    setShowSuccessCelebration(false);
  };

  return (
    <>
      <div className={`min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f6f2] to-[#e0e7ff] dark:from-[#18181b] dark:via-[#23243a] dark:to-[#1a1f2b] flex items-center justify-center p-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {config.icon}
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join Us'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-[#7ef9c0] to-[#a259f7] text-white`}>
                {config.title}
              </span>
            </div>
          </motion.div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-[#23243a] rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-[#23243a] mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Select Your Role
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(roleConfig) as UserRole[]).map((role) => (
                <motion.button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setFormData(prev => ({ ...prev, role }));
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    selectedRole === role
                      ? `border-blue-500 bg-blue-50 dark:bg-[#23243a]`
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{roleConfig[role].icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {roleConfig[role].title}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-[#23243a] rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23243a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="John"
                      required={mode === 'signup'}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23243a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Doe"
                      required={mode === 'signup'}
                    />
                  </motion.div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23243a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="john@example.com"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23243a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </motion.div>

              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23243a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    required={mode === 'signup'}
                  />
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${config.color} hover:shadow-lg`
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </motion.button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => handleSocialLogin('google')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </motion.button>

                <motion.button
                  onClick={() => handleSocialLogin('github')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="ml-2">GitHub</span>
                </motion.button>
              </div>
            </div>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors duration-200"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Notifications */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={notification.type === 'success' ? 8000 : 6000}
      />

      {/* Success Celebration */}
      <SuccessCelebration
        isVisible={showSuccessCelebration}
        onComplete={handleSuccessCelebrationComplete}
        message={`Welcome ${formData.firstName}! Your account has been created successfully. Let's set up your profile to get you started!`}
      />
    </>
  );
} 