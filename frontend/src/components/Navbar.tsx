'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "MCQs", href: "/mcqs" },
  { name: "Coding Questions", href: "/coding-questions" },
  { name: "Hackathons", href: "/hackathons" },
  { name: "AI Mock Interviews", href: "/ai-mock-interviews" },
  { name: "Resume Maker", href: "/resume-maker" },
];

export default function Navbar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <motion.nav
      className="w-full z-50 bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0"
      initial={{ opacity: 0, y: -40 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold text-blue-600 group-hover:scale-105 transition-transform duration-200">
            <span className="inline-block align-middle">&lt;/&gt;</span> code<span className="text-indigo-500">Veer</span>
          </span>
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-gray-700 font-medium px-2 py-1 rounded group"
            >
              <span className="hover:text-blue-600 transition-colors duration-200">
                {link.name}
              </span>
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
            </Link>
          ))}
        </div>
        {/* Actions */}
        <div className="flex gap-2 items-center">
          <Link
            href="/signin"
            className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-white border border-blue-600 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/get-started"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
} 