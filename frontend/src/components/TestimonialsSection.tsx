'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Software Engineer at Google",
    text: '"codeVeer\'s AI mock interviews were incredibly helpful. The feedback was detailed and helped me identify areas for improvement."',
    avatar: "/avatar1.png",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    role: "Full Stack Developer at Meta",
    text: '"The gamified learning approach made studying fun. I loved earning badges and competing with friends on the leaderboard."',
    avatar: "/avatar2.png",
    stars: 5,
  },
  {
    name: "Mike Rodriguez",
    role: "Backend Engineer at Amazon",
    text: '"Comprehensive platform with everything I needed. The system design section was particularly valuable for senior roles."',
    avatar: "/avatar3.png",
    stars: 5,
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};
const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function TestimonialsSection() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className={`w-full py-16 md:py-24 bg-gradient-to-b from-white to-blue-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: "spring" }}
        >
          What Our Users Say
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-10 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          Join thousands of successful candidates who landed their dream jobs
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col items-start shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              variants={card}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #2563eb22" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 bg-gray-100"
                  onError={e => (e.currentTarget.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=' + encodeURIComponent(t.name))}
                />
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{t.text}</p>
              <motion.div className="flex gap-1" initial="hidden" animate={show ? "show" : "hidden"}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-yellow-400 text-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 300 }}
                  >
                    ★
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 