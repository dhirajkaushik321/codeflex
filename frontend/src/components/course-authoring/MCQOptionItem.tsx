'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { MCQOption } from '@/types/mcq';
import MCQQuillEditor from './MCQQuillEditor';

interface MCQOptionItemProps {
  option: MCQOption;
  index: number;
  isSelected?: boolean;
  isMultiSelect?: boolean;
  onUpdate: (optionId: string, updates: Partial<MCQOption>) => void;
  onDelete: (optionId: string) => void;
  onSelect?: (optionId: string) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export default function MCQOptionItem({
  option,
  index,
  isSelected = false,
  isMultiSelect = false,
  onUpdate,
  onDelete,
  onSelect,
  dragHandleProps,
  isDragging = false
}: MCQOptionItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (content: string) => {
    onUpdate(option.id, { content });
  };

  const handleCorrectToggle = () => {
    onUpdate(option.id, { isCorrect: !option.isCorrect });
  };

  const handleDelete = () => {
    onDelete(option.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group relative flex items-start bg-gray-50 dark:bg-[#23243a] rounded-lg px-4 py-3 shadow-sm transition-all duration-200 ease-in-out ${
        isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 scale-100' 
          : 'hover:bg-gray-100 dark:hover:bg-[#2a2b3a]'
      } ${isDragging ? 'opacity-50' : ''}`}
      tabIndex={0}
      role="option"
      aria-selected={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(option.id);
        }
      }}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="flex-shrink-0 mr-3 mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Drag to reorder option"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Option Number */}
      <div className="flex-shrink-0 mr-3 mt-1">
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
          {String.fromCharCode(65 + index)} {/* A, B, C, D... */}
        </div>
      </div>

      {/* Correct Answer Toggle */}
      <div className="flex-shrink-0 mr-3 mt-1">
        <input
          type={isMultiSelect ? 'checkbox' : 'radio'}
          checked={option.isCorrect}
          onChange={handleCorrectToggle}
          className={`w-4 h-4 accent-blue-600 ${
            isMultiSelect ? 'rounded' : 'rounded-full'
          }`}
          aria-label={`Mark option ${String.fromCharCode(65 + index)} as ${option.isCorrect ? 'incorrect' : 'correct'}`}
        />
      </div>

      {/* Rich Text Content */}
      <div className="flex-1 min-w-0">
        <MCQQuillEditor
          content={option.content}
          onChange={handleContentChange}
          placeholder={`Option ${String.fromCharCode(65 + index)}...`}
          className="min-h-[80px]"
          showToolbar={false}
        />
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 ml-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label={`Delete option ${String.fromCharCode(65 + index)}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 border-2 border-blue-600 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  );
} 