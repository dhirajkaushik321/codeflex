'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    text: "codeVeer helped me ace my technical interviews. The AI mock interviews are incredibly realistic and the coding challenges are top-notch.",
    stars: 5,
    avatar: "/avatar1.png",
  },
  {
    name: "Alex Rodriguez",
    role: "Senior Developer at Microsoft",
    text: "The system design section is fantastic. I learned more in a week than I did in months of self-study. Highly recommended!",
    stars: 5,
    avatar: "/avatar2.png",
  },
  {
    name: "Emily Watson",
    role: "Full Stack Developer at Amazon",
    text: "Gamified learning made interview prep fun instead of stressful. I landed my dream job thanks to codeVeer's comprehensive approach.",
    stars: 5,
    avatar: "/avatar3.png",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
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
    <section id="testimonials" className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: "spring" }}
        >
          What Our Users Say
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 mb-10 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          Join thousands of developers who have successfully landed their dream jobs
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-start shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              variants={card}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #2563eb22" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                  width={48}
                  height={48}
                  onError={e => (e.currentTarget.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=' + encodeURIComponent(t.name))}
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{t.text}</p>
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