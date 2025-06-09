'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

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
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setShow(true);
    setMounted(true);
  }, []);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <motion.nav
      className="w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 sticky top-0"
      initial={{ opacity: 0, y: -40 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-200">
            <span className="inline-block align-middle">&lt;/&gt;</span> code<span className="text-indigo-500 dark:text-indigo-400">Veer</span>
          </span>
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-gray-700 dark:text-gray-200 font-medium px-2 py-1 rounded group"
            >
              <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                {link.name}
              </span>
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 dark:bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
            </Link>
          ))}
        </div>
        {/* Actions */}
        <div className="flex gap-2 items-center">
          {/* Theme Toggle */}
          <button
            aria-label="Toggle Theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
          >
            <motion.span
              key={isDark ? "moon" : "sun"}
              initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block"
            >
              {isDark ? (
                <svg width="22" height="22" fill="currentColor" className="text-yellow-400" viewBox="0 0 24 24"><path d="M21.75 15.5A9.75 9.75 0 0 1 8.5 2.25a.75.75 0 0 0-.75.75v.25A9.25 9.25 0 1 0 20.75 16.25h.25a.75.75 0 0 0 .75-.75Z"/></svg>
              ) : (
                <svg width="22" height="22" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 2.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 12 20.5Zm0-17a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 12 3.5Zm8.5 8.5a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-1.5 0v-.01a.75.75 0 0 1 .75-.75Zm-17 0a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-1.5 0v-.01A.75.75 0 0 1 3.5 12Zm14.45 5.03a.75.75 0 0 1 1.06 1.06l-.71.71a.75.75 0 1 1-1.06-1.06l.71-.71Zm-12.02 0a.75.75 0 0 1 1.06 1.06l-.71.71a.75.75 0 1 1-1.06-1.06l.71-.71Zm-12.02 0a.75.75 0 0 1 1.06 0l.71.71a.75.75 0 1 1-1.06 1.06l-.71-.71a.75.75 0 0 1 0-1.06Zm12.02-10.06a.75.75 0 0 1 1.06 1.06l-.71.71a.75.75 0 1 1-1.06-1.06l.71-.71Zm-12.02 0a.75.75 0 0 1 1.06 0l.71.71a.75.75 0 1 1-1.06 1.06l-.71-.71a.75.75 0 0 1 0-1.06Z"/></svg>
              )}
            </motion.span>
          </button>
          <Link
            href="/signin"
            className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/get-started"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 dark:bg-blue-600 rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
} 