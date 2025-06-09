'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

// Navigation links for authenticated users
const authenticatedNavLinks = [
  { name: "Home", href: "/" },
  { name: "MCQs", href: "/mcqs" },
  { name: "Coding Questions", href: "/coding-questions" },
  { name: "Hackathons", href: "/hackathons" },
  { name: "AI Mock Interviews", href: "/ai-mock-interviews" },
  { name: "Resume Maker", href: "/resume-maker" },
];

// Navigation links for unauthenticated users
const unauthenticatedNavLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    setShow(true);
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const handleUnauthenticatedLinkClick = (e: React.MouseEvent, linkName: string) => {
    e.preventDefault();
    const link = unauthenticatedNavLinks.find(l => l.name === linkName);
    if (link && link.href.startsWith('#')) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) {
          const navbarHeight = 80; // Height of the sticky navbar
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = isAuthenticated ? authenticatedNavLinks : unauthenticatedNavLinks;

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
            isAuthenticated ? (
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
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleUnauthenticatedLinkClick(e, link.name)}
                className="relative text-gray-700 dark:text-gray-200 font-medium px-2 py-1 rounded group cursor-pointer"
              >
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  {link.name}
                </span>
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 dark:bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
              </a>
            )
          ))}
          
          {/* Show Complete Profile link only for authenticated users with incomplete profiles */}
          {isAuthenticated && user && !user.isProfileComplete && (
            <Link
              href="/signup"
              className="relative text-orange-600 dark:text-orange-400 font-medium px-2 py-1 rounded group"
            >
              <span className="hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-200">
                Complete Profile
              </span>
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-orange-600 dark:bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          {/* Theme Toggle */}
          <button
            aria-label="Toggle Theme"
            onClick={() => {}}
            className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
          >
            <motion.span
              key="sun"
              initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block"
            >
              <svg width="22" height="22" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 2.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 12 20.5Zm0-17a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 12 3.5Zm8.5 8.5a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-1.5 0v-.01a.75.75 0 0 1 .75-.75Zm-17 0a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-1.5 0v-.01A.75.75 0 0 1 3.5 12Zm14.45 5.03a.75.75 0 0 1 1.06 1.06l-.71.71a.75.75 0 1 1-1.06-1.06l.71-.71Zm-12.02 0a.75.75 0 0 1 1.06 1.06l-.71.71a.75.75 0 1 1-1.06-1.06l.71-.71Zm-12.02 0a.75.75 0 0 1 1.06 0l.71.71a.75.75 0 1 1-1.06 1.06l-.71-.71a.75.75 0 0 1 0-1.06Zm12.02-10.06a.75.75 0 0 1 1.06 1.06l-.71.71a.75.75 0 1 1-1.06-1.06l.71-.71Zm-12.02 0a.75.75 0 0 1 1.06 0l.71.71a.75.75 0 1 1-1.06 1.06l-.71-.71a.75.75 0 0 1 0-1.06Z"/></svg>
            </motion.span>
          </button>

          {/* Authentication Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.firstName}
                </span>
              </div>
              
              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 dark:bg-red-600 rounded-lg shadow hover:bg-red-700 dark:hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 dark:bg-blue-600 rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors duration-200"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              isAuthenticated ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-700 dark:text-gray-200 font-medium py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleUnauthenticatedLinkClick(e, link.name)}
                  className="block text-gray-700 dark:text-gray-200 font-medium py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                >
                  {link.name}
                </a>
              )
            ))}
            
            {/* Show Complete Profile link only for authenticated users with incomplete profiles */}
            {isAuthenticated && user && !user.isProfileComplete && (
              <Link
                href="/signup"
                className="block text-orange-600 dark:text-orange-400 font-medium py-2 hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Complete Profile
              </Link>
            )}

            {/* Mobile authentication buttons */}
            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.firstName}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-semibold text-white bg-red-600 dark:bg-red-600 rounded-lg shadow hover:bg-red-700 dark:hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href="/auth"
                  className="block w-full text-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 dark:bg-blue-600 rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
} 