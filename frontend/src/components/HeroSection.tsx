'use client';
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80";

export default function HeroSection() {
  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState("/dashboard-mockup.png");
  useEffect(() => {
    setShow(true);
  }, []);

  // 3D Parallax logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [12, -12]);
  const rotateY = useTransform(x, [-50, 50], [-12, 12]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const xVal = ((px / rect.width) - 0.5) * 100;
    const yVal = ((py / rect.height) - 0.5) * 100;
    x.set(xVal);
    y.set(yVal);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text */}
        <motion.div
          className="flex-1 flex flex-col gap-6"
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight"
            initial={{ opacity: 0, x: -40 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, type: "spring" }}
          >
            Master Technical Interviews with <span className="text-blue-600 dark:text-blue-400">code<span className="text-indigo-500 dark:text-indigo-400">Veer</span></span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl"
            variants={item}
          >
            Comprehensive preparation platform featuring AI mock interviews, coding challenges, system design, and gamified learning to land your dream tech job.
          </motion.p>
          <motion.div className="flex gap-4 flex-wrap" variants={item}>
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
              className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold rounded-lg border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 text-base cursor-pointer"
            >
              Watch Demo
            </motion.a>
          </motion.div>
          <motion.div className="flex gap-6 mt-4 flex-wrap" variants={item}>
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, type: "spring" }}
              >
                <span className="text-xl">{f.icon}</span> {f.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Right: Dashboard Image Mockup with 3D Parallax */}
        <motion.div
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
          animate={show ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <motion.div
            ref={ref}
            className="relative w-[340px] h-[260px] md:w-[420px] md:h-[320px] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="w-full h-full"
            >
              <Image
                src={imgSrc}
                alt="Modern dashboard for technical interview prep platform"
                fill
                className="object-cover"
                priority
                onError={() => setImgSrc(fallbackImage)}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 