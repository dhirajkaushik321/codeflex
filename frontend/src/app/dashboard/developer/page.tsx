'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DeveloperDashboard() {
  const stats = [
    { label: 'Questions Solved', value: '247', icon: '✅' },
    { label: 'Current Streak', value: '12 days', icon: '🔥' },
    { label: 'Rank', value: '#1,234', icon: '🏆' },
    { label: 'Points', value: '8,450', icon: '⭐' }
  ];

  const recentActivities = [
    { type: 'Solved', title: 'Two Sum', difficulty: 'Easy', time: '2 hours ago' },
    { type: 'Attempted', title: 'Valid Parentheses', difficulty: 'Medium', time: '1 day ago' },
    { type: 'Completed', title: 'JavaScript Basics', difficulty: 'Easy', time: '2 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, Developer! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Ready to ace your next technical interview?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                💻 Developer
              </span>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Profile
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/coding-questions">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💻</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Practice Coding
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Solve coding challenges
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                <Link href="/mcqs">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📝</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Take MCQs
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Test your knowledge
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                <Link href="/ai-mock-interviews">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          AI Mock Interview
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Practice with AI
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                <Link href="/resume-maker">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📄</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Resume Builder
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Create your resume
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="text-lg">
                    {activity.type === 'Solved' && '✅'}
                    {activity.type === 'Attempted' && '🔄'}
                    {activity.type === 'Completed' && '🎉'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.difficulty} • {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 