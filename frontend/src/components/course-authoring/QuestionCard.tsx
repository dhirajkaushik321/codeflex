'use client';

import MCQQuillEditor from './MCQQuillEditor';
import MCQOptionList from './MCQOptionList';
import MCQHintPanel from './MCQHintPanel';
import MCQExplanationPanel from './MCQExplanationPanel';
import { MCQQuestion, MCQOption } from '@/types/mcq';

interface QuestionCardProps {
  question: MCQQuestion;
  onPromptChange: (prompt: string) => void;
  onOptionsChange: (options: MCQOption[]) => void;
  onHintChange: (hint: string) => void;
  onExplanationChange: (explanation: string) => void;
  isMultiSelect?: boolean;
}

export default function QuestionCard({
  question,
  onPromptChange,
  onOptionsChange,
  onHintChange,
  onExplanationChange,
  isMultiSelect = false,
}: QuestionCardProps) {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-lg shadow-md px-12 py-8 w-full max-w-4xl mx-auto animate-fadeInUp">
      {/* Question Prompt */}
      <div className="mb-6">
        <label className="block text-[20px] font-bold font-inter text-gray-900 dark:text-white mb-2">
          Question Prompt
        </label>
        <MCQQuillEditor
          content={question.prompt}
          onChange={onPromptChange}
          placeholder="Write your question prompt..."
        />
      </div>

      {/* Options */}
      <div className="mb-6">
        <label className="block text-[16px] font-medium font-inter text-gray-800 dark:text-gray-200 mb-2">
          Answer Options
        </label>
        <MCQOptionList
          options={question.options}
          isMultiSelect={isMultiSelect}
          onOptionsChange={onOptionsChange}
        />
      </div>

      {/* Hint Panel */}
      <div className="mb-4">
        <MCQHintPanel
          hint={question.hint || ''}
          onHintChange={onHintChange}
        />
      </div>

      {/* Explanation Panel */}
      <div className="mb-4">
        <MCQExplanationPanel
          explanation={question.explanation || ''}
          onExplanationChange={onExplanationChange}
        />
      </div>
    </div>
  );
} 