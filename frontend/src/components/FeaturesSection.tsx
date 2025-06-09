'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "MCQs & Quizzes",
    desc: "Test your knowledge with thousands of multiple choice questions across various topics.",
    icon: "❓",
  },
  {
    title: "Coding Challenges",
    desc: "Practice with real coding problems and improve your problem-solving skills.",
    icon: "</>",
  },
  {
    title: "AI Mock Interviews",
    desc: "Practice with AI-powered mock interviews that simulate real interview scenarios.",
    icon: "🤖",
  },
  {
    title: "Resume Builder",
    desc: "Create professional resumes with our intuitive builder and templates.",
    icon: "📄",
  },
  {
    title: "System Design",
    desc: "Master system design concepts with interactive diagrams and case studies.",
    icon: "🛠️",
  },
  {
    title: "Gamified Learning",
    desc: "Learn through engaging games and earn points, badges, and achievements.",
    icon: "🏆",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};
const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function FeaturesSection() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: "spring" }}
        >
          Everything You Need to Succeed
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-10 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          Comprehensive tools and resources for technical interview preparation
        </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col items-start shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
              variants={card}
              whileHover={{ scale: 1.06, rotateY: 8, boxShadow: "0 8px 32px #2563eb22" }}
              style={{ perspective: 800 }}
            >
              <motion.div
                className="text-3xl mb-4 bg-white rounded-full p-2 shadow group-hover:bg-blue-100 transition-colors duration-200"
                whileHover={{ rotate: 12, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 