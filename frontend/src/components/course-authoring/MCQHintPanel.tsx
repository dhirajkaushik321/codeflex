'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import MCQQuillEditor from './MCQQuillEditor';

interface MCQHintPanelProps {
  hint: string;
  onHintChange: (hint: string) => void;
  className?: string;
}

export default function MCQHintPanel({
  hint,
  onHintChange,
  className = ""
}: MCQHintPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={toggleOpen}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls="hint-content"
      >
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Hint
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="hint-content"
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 300, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <MCQQuillEditor
                content={hint}
                onChange={onHintChange}
                placeholder="Provide a helpful hint for students..."
                className="min-h-[100px]"
                showToolbar={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 