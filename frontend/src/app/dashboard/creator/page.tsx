'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CreatorDashboard() {
  const stats = [
    { label: 'Content Created', value: '45', icon: '✍️' },
    { label: 'Total Views', value: '12.5K', icon: '👁️' },
    { label: 'Likes Received', value: '2.3K', icon: '❤️' },
    { label: 'Creator Score', value: '8.7/10', icon: '⭐' }
  ];

  const recentContent = [
    { type: 'Coding Question', title: 'Binary Tree Traversal', status: 'Published', views: '1.2K', time: '2 hours ago' },
    { type: 'Tutorial', title: 'React Hooks Deep Dive', status: 'Draft', views: '0', time: '1 day ago' },
    { type: 'MCQ Set', title: 'JavaScript Fundamentals', status: 'Published', views: '856', time: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 pt-20">
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
                Welcome back, Creator! ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Ready to share your knowledge with the community?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                ✍️ Content Creator
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
                Create Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/creator/coding-question">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💻</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Coding Question
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Create programming challenges
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                <Link href="/creator/tutorial">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📚</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Tutorial
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Write educational content
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                <Link href="/creator/mcq">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📝</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          MCQ Set
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Create multiple choice questions
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                <Link href="/creator/analytics">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📊</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Analytics
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          View content performance
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Recent Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Content
            </h2>
            <div className="space-y-4">
              {recentContent.map((content, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                      {content.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      content.status === 'Published' 
                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900' 
                        : 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      {content.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {content.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {content.views} views
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {content.time}
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