'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MCQQuiz, MCQQuestion, MCQQuizSettings } from '@/types/mcq';
import MCQSettingsDrawer from './MCQSettingsDrawer';
import QuestionCard from './QuestionCard';
import { CourseNode } from './CourseSidebar';

interface QuizEditorContainerProps {
  quizNode?: CourseNode;
}

// Default settings for a new quiz
const defaultSettings: MCQQuizSettings = {
  shuffleOptions: false,
  timeLimit: undefined,
  maxAttempts: undefined,
  showHints: true,
  showExplanations: true,
  allowReview: true,
  passingScore: 70,
  pointsPerQuestion: 1,
};

// Dummy initial quiz for demo
const initialQuiz: MCQQuiz = {
  id: 'quiz-1',
  title: 'Untitled Quiz',
  description: '',
  questions: [
    {
      id: 'q-1',
      prompt: '',
      options: [],
      type: 'single-select',
      points: 1,
      difficulty: 'beginner',
      hint: '',
      explanation: '',
      tags: [],
      order: 0,
    },
  ],
  settings: defaultSettings,
  status: 'draft',
  createdAt: new Date(),
  updatedAt: new Date(),
  order: 0,
};

export default function QuizEditorContainer({ quizNode }: QuizEditorContainerProps) {
  // If quizNode is provided, use its data to initialize the quiz (future: sync with backend)
  const [quiz, setQuiz] = useState<MCQQuiz>(initialQuiz);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (quizNode && quizNode.type === 'quiz') {
      // Optionally, hydrate quiz state from quizNode (if it contains MCQQuiz data)
      // For now, just set the title
      setQuiz((prev) => ({ ...prev, title: quizNode.title || 'Untitled Quiz' }));
    }
  }, [quizNode]);

  const currentQuestion = quiz.questions[currentQuestionIdx];

  // Handlers
  const handleQuestionChange = (updates: Partial<MCQQuestion>) => {
    setQuiz((prev) => {
      const questions = [...prev.questions];
      questions[currentQuestionIdx] = { ...questions[currentQuestionIdx], ...updates };
      return { ...prev, questions };
    });
  };

  const handleOptionsChange = (options: MCQQuestion['options']) => {
    handleQuestionChange({ options });
  };

  const handleHintChange = (hint: string) => {
    handleQuestionChange({ hint });
  };

  const handleExplanationChange = (explanation: string) => {
    handleQuestionChange({ explanation });
  };

  const handleSettingsChange = (settings: MCQQuizSettings) => {
    setQuiz((prev) => ({ ...prev, settings }));
  };

  const handleAddQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q-${Date.now()}`,
          prompt: '',
          options: [],
          type: 'single-select',
          points: 1,
          difficulty: 'beginner',
          hint: '',
          explanation: '',
          tags: [],
          order: prev.questions.length,
        },
      ],
    }));
    setCurrentQuestionIdx(quiz.questions.length); // Focus new question
  };

  const handlePrev = () => {
    setCurrentQuestionIdx((idx) => Math.max(0, idx - 1));
  };
  const handleNext = () => {
    setCurrentQuestionIdx((idx) => Math.min(quiz.questions.length - 1, idx + 1));
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e6f6f2] to-[#e0e7ff] dark:from-[#18181b] dark:via-[#23243a] dark:to-[#1a1f2b] px-4 py-8">
      {/* Progress Bar & Controls */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-6">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Question {currentQuestionIdx + 1} of {quiz.questions.length}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIdx === 0}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIdx === quiz.questions.length - 1}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={handleAddQuestion}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            + Add Question
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <QuestionCard
        question={currentQuestion}
        onPromptChange={(prompt) => handleQuestionChange({ prompt })}
        onOptionsChange={handleOptionsChange}
        onHintChange={handleHintChange}
        onExplanationChange={handleExplanationChange}
        isMultiSelect={currentQuestion.type === 'multi-select'}
      />

      {/* Settings Drawer */}
      <MCQSettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={quiz.settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
} 