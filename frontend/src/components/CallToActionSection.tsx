'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CallToActionSection() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <motion.section
      className="w-full py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-700 dark:to-indigo-700"
      initial={{ opacity: 0, y: 80 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-8 flex flex-col items-center text-center gap-6">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-white mb-2"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          Ready to Land Your Dream Job?
        </motion.h2>
        <motion.p
          className="text-lg text-blue-100 dark:text-blue-200 mb-6 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          Join thousands of successful candidates and start your preparation journey today.
        </motion.p>
        <div className="flex gap-4 flex-wrap justify-center">
          <motion.a
            href="#"
            whileHover={{ scale: 1.08, boxShadow: "0 4px 24px #fff6" }}
            className="px-6 py-3 bg-white dark:bg-gray-100 text-blue-700 dark:text-blue-800 font-semibold rounded-lg shadow hover:bg-blue-50 dark:hover:bg-gray-200 transition-colors duration-200 text-base cursor-pointer"
          >
            Start Free Trial
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.08, boxShadow: "0 4px 24px #fff6" }}
            className="px-6 py-3 bg-blue-700 dark:bg-blue-800 text-white font-semibold rounded-lg border border-white dark:border-gray-200 hover:bg-white dark:hover:bg-gray-100 hover:text-blue-700 dark:hover:text-blue-800 transition-colors duration-200 text-base cursor-pointer"
          >
            View Pricing
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
} 