'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Footer from '../../components/Footer';

// Mock user data - in real app this would come from API/context
const mockUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  location: 'San Francisco, CA',
  experienceLevel: 'Mid Level (3-5 years)',
  currentRole: 'Full Stack Developer',
  company: 'Tech Corp',
  programmingLanguages: ['JavaScript', 'TypeScript', 'Python', 'React'],
  frameworks: ['React', 'Node.js', 'Express'],
  databases: ['MongoDB', 'PostgreSQL'],
  preferredJobRoles: ['Full Stack Developer', 'Senior Developer'],
  codingInterests: ['Web Development', 'AI/ML'],
  careerGoals: 'To become a technical lead and mentor junior developers while working on innovative projects.'
};

const personalizedContent = {
  recommendedMCQs: [
    { id: 1, title: 'JavaScript Fundamentals', difficulty: 'Intermediate', category: 'Frontend' },
    { id: 2, title: 'React Hooks Deep Dive', difficulty: 'Advanced', category: 'Frontend' },
    { id: 3, title: 'Node.js Performance', difficulty: 'Intermediate', category: 'Backend' },
    { id: 4, title: 'Database Design Patterns', difficulty: 'Advanced', category: 'Database' },
  ],
  recommendedCodingQuestions: [
    { id: 1, title: 'Implement a Custom Hook', difficulty: 'Medium', category: 'React' },
    { id: 2, title: 'Build a REST API', difficulty: 'Medium', category: 'Node.js' },
    { id: 3, title: 'Optimize Database Queries', difficulty: 'Hard', category: 'Database' },
  ],
  upcomingHackathons: [
    { id: 1, title: 'AI/ML Innovation Challenge', date: '2024-02-15', category: 'AI/ML' },
    { id: 2, title: 'Full Stack Development Contest', date: '2024-02-20', category: 'Web Development' },
  ]
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {mockUserData.firstName}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here's your personalized learning dashboard
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {mockUserData.firstName[0]}{mockUserData.lastName[0]}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mockUserData.firstName} {mockUserData.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{mockUserData.currentRole}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mockUserData.company}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockUserData.programmingLanguages.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockUserData.codingInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Career Goals</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {mockUserData.careerGoals}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Recommended MCQs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recommended MCQs for You
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedContent.recommendedMCQs.map((mcq) => (
                  <motion.div
                    key={mcq.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{mcq.title}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mcq.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                        mcq.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {mcq.difficulty}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{mcq.category}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended Coding Questions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Practice Coding Questions
              </h3>
              <div className="space-y-4">
                {personalizedContent.recommendedCodingQuestions.map((question) => (
                  <motion.div
                    key={question.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{question.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{question.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upcoming Hackathons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Upcoming Hackathons
              </h3>
              <div className="space-y-4">
                {personalizedContent.upcomingHackathons.map((hackathon) => (
                  <motion.div
                    key={hackathon.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{hackathon.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{hackathon.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(hackathon.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Registration Open</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 