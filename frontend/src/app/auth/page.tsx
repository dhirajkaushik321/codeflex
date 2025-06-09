'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const userTypes = [
  {
    id: 'developer',
    title: 'Developer',
    subtitle: 'Practice, Learn & Prepare',
    description: 'Access coding challenges, MCQs, mock interviews, and learning resources to ace your technical interviews.',
    icon: '💻',
    color: 'from-blue-500 to-indigo-600',
    href: '/auth/developer'
  },
  {
    id: 'creator',
    title: 'Content Creator',
    subtitle: 'Create & Share Knowledge',
    description: 'Create coding questions, tutorials, and educational content to help the developer community.',
    icon: '✍️',
    color: 'from-purple-500 to-pink-600',
    href: '/auth/creator'
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Platform Management',
    description: 'Access analytics, user management, content moderation, and platform administration tools.',
    icon: '⚙️',
    color: 'from-green-500 to-teal-600',
    href: '/auth/admin'
  }
];

export default function AuthPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 pt-24">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to <span className="text-blue-600 dark:text-blue-400">codeVeer</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your role and start your journey with our comprehensive technical interview preparation platform
          </p>
        </motion.div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={type.href}>
                <div
                  className={`relative group cursor-pointer rounded-2xl p-8 h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden`}
                  onMouseEnter={() => setHoveredCard(type.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-6 text-center"
                    animate={hoveredCard === type.id ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {type.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                      {type.title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-center mb-4">
                      {type.subtitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {type.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    className="absolute bottom-6 right-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    animate={hoveredCard === type.id ? { x: 5 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.293 4.707a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L12.586 12 7.293 6.707a1 1 0 0 1 0-1.414z"/>
                    </svg>
                  </motion.div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === type.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/developer/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 