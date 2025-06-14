'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { MCQOption } from '@/types/mcq';
import MCQOptionItem from './MCQOptionItem';

interface MCQOptionListProps {
  options: MCQOption[];
  isMultiSelect?: boolean;
  onOptionsChange: (options: MCQOption[]) => void;
  onOptionSelect?: (optionId: string) => void;
  selectedOptions?: string[];
}

function SortableOptionItem({
  option,
  index,
  isMultiSelect,
  isSelected,
  onUpdate,
  onDelete,
  onSelect,
}: {
  option: MCQOption;
  index: number;
  isMultiSelect?: boolean;
  isSelected?: boolean;
  onUpdate: (optionId: string, updates: Partial<MCQOption>) => void;
  onDelete: (optionId: string) => void;
  onSelect?: (optionId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <MCQOptionItem
        option={option}
        index={index}
        isSelected={isSelected}
        isMultiSelect={isMultiSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onSelect={onSelect}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

export default function MCQOptionList({
  options,
  isMultiSelect = false,
  onOptionsChange,
  onOptionSelect,
  selectedOptions = []
}: MCQOptionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = options.findIndex(option => option.id === active.id);
      const newIndex = options.findIndex(option => option.id === over?.id);

      const newOptions = arrayMove(options, oldIndex, newIndex);
      // Update order property for each option
      const reorderedOptions = newOptions.map((option, index) => ({
        ...option,
        order: index
      }));
      onOptionsChange(reorderedOptions);
    }
  };

  const handleOptionUpdate = (optionId: string, updates: Partial<MCQOption>) => {
    const newOptions = options.map(option =>
      option.id === optionId ? { ...option, ...updates } : option
    );
    onOptionsChange(newOptions);
  };

  const handleOptionDelete = (optionId: string) => {
    const newOptions = options.filter(option => option.id !== optionId);
    // Reorder remaining options
    const reorderedOptions = newOptions.map((option, index) => ({
      ...option,
      order: index
    }));
    onOptionsChange(reorderedOptions);
  };

  const handleAddOption = () => {
    const newOption: MCQOption = {
      id: `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: '',
      isCorrect: false,
      order: options.length,
    };
    onOptionsChange([...options, newOption]);
  };

  return (
    <div className="space-y-4">
      {/* Options List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={options.map(option => option.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            <AnimatePresence>
              {options.map((option, index) => (
                <SortableOptionItem
                  key={option.id}
                  option={option}
                  index={index}
                  isMultiSelect={isMultiSelect}
                  isSelected={selectedOptions.includes(option.id)}
                  onUpdate={handleOptionUpdate}
                  onDelete={handleOptionDelete}
                  onSelect={onOptionSelect}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Option Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddOption}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center space-x-2"
        aria-label="Add new option"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Option</span>
      </motion.button>

      {/* Instructions */}
      <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <p className="mb-2">
          <strong>Instructions:</strong>
        </p>
        <ul className="space-y-1 text-xs">
          <li>• Drag options to reorder them</li>
          <li>• Click the radio/checkbox to mark correct answers</li>
          <li>• Use the rich text editor to format option content</li>
          <li>• Hover over options to see delete button</li>
        </ul>
      </div>
    </div>
  );
} 