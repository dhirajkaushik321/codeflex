'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import MCQQuillEditor from './MCQQuillEditor';

interface MCQExplanationPanelProps {
  explanation: string;
  onExplanationChange: (explanation: string) => void;
  className?: string;
}

export default function MCQExplanationPanel({
  explanation,
  onExplanationChange,
  className = ""
}: MCQExplanationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={toggleOpen}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls="explanation-content"
      >
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-300">
            Explanation
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="explanation-content"
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 400, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <MCQQuillEditor
                content={explanation}
                onChange={onExplanationChange}
                placeholder="Provide a detailed explanation of the correct answer..."
                className="min-h-[150px]"
                showToolbar={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 