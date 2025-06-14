import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Name / Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
          <Image src="/logo.PNG" alt="CodeFlex Logo" width={32} height={32} className="rounded-full shadow-md" priority />
          Code<span className="text-indigo-500 dark:text-indigo-400">Flex</span>
        </Link>

        {/* Navigation (expand as needed) */}
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Dashboard
          </Link>
          {/* Add more nav links here if needed */}
        </nav>

        {/* User Avatar/Profile (placeholder) */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 hover:ring-2 hover:ring-blue-400 transition-all">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.header>
  );
} 