'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "1000+", label: "Coding Problems" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "AI Support" },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function AboutSection() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section id="about" className="w-full py-16 md:py-24 bg-gradient-to-br from-[#f8fafc] via-[#e6f6f2] to-[#e0e7ff] dark:from-[#18181b] dark:via-[#23243a] dark:to-[#1a1f2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          className="text-center mb-16"
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          <div className="flex justify-center mb-4">
            <Image src="/logo.PNG" alt="CodeFlex Logo" width={48} height={48} className="rounded-full shadow-lg" priority />
          </div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            variants={item}
          >
            About CodeFlex
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
            variants={item}
          >
            We're on a mission to democratize technical interview preparation. Our platform combines 
            cutting-edge AI technology with proven learning methodologies to help developers of all 
            levels succeed in their career goals.
          </motion.p>
          
          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            animate={show ? "show" : "hidden"}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={item}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mission and Values */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              To provide accessible, comprehensive, and effective technical interview preparation 
              that empowers developers to showcase their true potential and land their dream jobs.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Personalized learning paths based on your experience level
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Real-time feedback and progress tracking
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Industry-aligned content updated regularly
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#e6f6f2] to-[#e0e7ff] dark:from-[#23243a] dark:to-[#1a1f2b] rounded-2xl p-8"
            variants={item}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CodeFlex?
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 dark:bg-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">AI-Powered Learning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Adaptive algorithms that learn from your performance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Targeted Practice</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Focus on your weak areas with smart recommendations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 dark:bg-green-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🏆</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Proven Results</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">95% of users report improved interview performance</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 