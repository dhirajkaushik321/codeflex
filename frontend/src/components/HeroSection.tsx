'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  { text: "Free to start", icon: "✅" },
  { text: "AI-powered", icon: "🤖" },
  { text: "Gamified learning", icon: "🎮" },
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

export default function HeroSection() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text */}
        <motion.div
          className="flex-1 flex flex-col gap-6"
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
            initial={{ opacity: 0, x: -40 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, type: "spring" }}
          >
            Master Technical Interviews with <span className="text-blue-600">code<span className="text-indigo-500">Veer</span></span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-xl"
            variants={item}
          >
            Comprehensive preparation platform featuring AI mock interviews, coding challenges, system design, and gamified learning to land your dream tech job.
          </motion.p>
          <motion.div className="flex gap-4 mt-2" variants={item}>
            <motion.a
              href="#"
              whileHover={{ scale: 1.08, boxShadow: "0 4px 24px #2563eb33" }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 text-base cursor-pointer"
            >
              Start Preparing Now
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.08, boxShadow: "0 4px 24px #2563eb33" }}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors duration-200 text-base cursor-pointer"
            >
              Watch Demo
            </motion.a>
          </motion.div>
          <motion.div className="flex gap-6 mt-4 flex-wrap" variants={item}>
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                className="flex items-center gap-2 text-gray-700 text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, type: "spring" }}
              >
                <span className="text-xl">{f.icon}</span> {f.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Right: Dashboard Image Mockup */}
        <motion.div
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
          animate={show ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <motion.div
            className="relative w-[340px] h-[260px] md:w-[420px] md:h-[320px] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white"
            whileHover={{ rotateY: 10, scale: 1.04, boxShadow: "0 8px 32px #6366f133" }}
            style={{ perspective: 1000 }}
          >
            <Image
              src="/dashboard-mockup.png"
              alt="Dashboard Mockup"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 