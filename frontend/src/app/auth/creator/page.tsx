'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CreatorAuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4 pt-24">
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
            ✍️
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Creator Access
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create & Share Knowledge with the Developer Community
          </p>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              Content Creator
            </span>
          </div>
        </motion.div>

        {/* Auth Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-4">
            <Link href="/auth/creator/login">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer text-center"
              >
                <div className="text-2xl mb-2">🔐</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Sign In
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account? Sign in here
                </p>
              </motion.div>
            </Link>

            <div className="text-center text-gray-500 dark:text-gray-400">
              or
            </div>

            <Link href="/auth/creator/signup">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:shadow-lg transition-all cursor-pointer text-center"
              >
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-white">
                  Create Account
                </h3>
                <p className="text-sm text-purple-100">
                  Start creating amazing content
                </p>
              </motion.div>
            </Link>
          </div>

          {/* Back to Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Link 
              href="/auth" 
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              ← Back to role selection
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 