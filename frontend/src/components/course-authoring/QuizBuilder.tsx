'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import QuillEditor from './QuillEditor';
import { Quiz, QuizQuestion } from '@/types/course';

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="text-sm text-gray-500 font-medium tracking-wide mb-4">
      Question {current} of {total}
    </div>
  );
}

function OptionItem({
  option,
  index,
  selected,
  onSelect,
  onDelete,
  onEdit,
  dragHandleProps,
  isDragging,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 bg-white">
        <div className={`w-3 h-3 rounded-full transition-colors ${selected ? 'bg-blue-500' : 'bg-transparent'}`} />
      </div>
      <input
        type="text"
        value={option.text}
        onChange={e => onEdit(option.id, e.target.value)}
        className="flex-1 text-base font-medium text-gray-800 bg-transparent border-none outline-none focus:ring-0 px-2 py-1 min-w-0"
        placeholder={`Option ${index + 1}`}
        aria-label={`Edit option ${index + 1}`}
      />
      <button
        onClick={onDelete}
        className="p-1 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
        aria-label="Delete option"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

function OptionList({ options, selectedId, onSelect, onDelete, onReorder, onEdit }: any) {
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = options.findIndex((o: any) => o.id === active.id);
      const newIndex = options.findIndex((o: any) => o.id === over?.id);
      onReorder(arrayMove(options, oldIndex, newIndex));
    }
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={options.map((o: any) => o.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-3 mt-8" role="radiogroup" aria-label="Answer options">
          {options.map((option: any, idx: number) => (
            <OptionItem
              key={option.id}
              option={option}
              index={idx}
              selected={selectedId === option.id}
              onSelect={() => onSelect(option.id)}
              onDelete={() => onDelete(option.id)}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

interface QuizBuilderProps {
  quiz?: Quiz;
  onSave?: (quiz: Quiz) => void;
}

export default function QuizBuilder({ quiz, onSave }: QuizBuilderProps) {
  const blankOption = () => ({ id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text: '' });
  const blankQuestion = () => ({
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt: '',
    options: [blankOption(), blankOption()],
    correctId: '',
    selectedId: null as string | null,
    feedback: null as 'correct' | 'incorrect' | null,
  });

  // Initialize questions from quiz prop or with a blank question
  const [questions, setQuestions] = useState([blankQuestion()]);
  const [current, setCurrent] = useState(0);
  const [quizTitle, setQuizTitle] = useState(quiz?.title || 'New Quiz');
  const [quizDescription, setQuizDescription] = useState(quiz?.description || '');

  // Load quiz data when quiz prop changes
  useEffect(() => {
    if (quiz) {
      setQuizTitle(quiz.title);
      setQuizDescription(quiz.description || '');
      
      if (quiz.questions && quiz.questions.length > 0) {
        // Convert QuizQuestion format to internal format
        const convertedQuestions = quiz.questions.map(q => ({
          id: q.id,
          prompt: q.question,
          options: q.options?.map((opt, idx) => ({
            id: `opt-${q.id}-${idx}`,
            text: opt
          })) || [blankOption(), blankOption()],
          correctId: q.correctAnswer ? `opt-${q.id}-${q.options?.indexOf(q.correctAnswer as string) || 0}` : '',
          selectedId: null,
          feedback: null,
        }));
        setQuestions(convertedQuestions);
        setCurrent(0);
      } else {
        setQuestions([blankQuestion()]);
        setCurrent(0);
      }
    }
  }, [quiz]);

  const q = questions[current];

  // Save quiz data to course state
  const saveQuiz = () => {
    if (!onSave) return;

    const quizData: Quiz = {
      id: quiz?.id || `quiz-${Date.now()}`,
      title: quizTitle,
      description: quizDescription,
      type: 'multiple-choice',
      questions: questions.map(q => ({
        id: q.id,
        question: q.prompt,
        type: 'multiple-choice',
        options: q.options.map(opt => opt.text),
        correctAnswer: q.correctId ? q.options.find(opt => opt.id === q.correctId)?.text : undefined,
        points: 1,
        difficulty: 'beginner'
      })),
      passingScore: 70,
      points: 100,
      difficulty: 'beginner',
      tags: [],
      order: quiz?.order || 0,
      status: quiz?.status || 'draft',
      estimatedTime: 15
    };

    onSave(quizData);
  };

  // Auto-save when questions change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (questions.length > 0 && questions.some(q => q.prompt.trim())) {
        saveQuiz();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [questions, quizTitle, quizDescription]);

  // Option handlers
  const handleAddOption = () => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? {
      ...q,
      options: [...q.options, blankOption()]
    } : q));
  };
  const handleDeleteOption = (id: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? {
      ...q,
      options: q.options.filter((o: any) => o.id !== id),
      correctId: q.correctId === id && q.options.length > 1 ? q.options[0].id : q.correctId,
      selectedId: q.selectedId === id ? null : q.selectedId,
    } : q));
  };
  const handleReorderOptions = (opts: any[]) => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? { ...q, options: opts } : q));
  };
  const handleEditOption = (id: string, text: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? {
      ...q,
      options: q.options.map((o: any) => o.id === id ? { ...o, text } : o)
    } : q));
  };
  const handleSelectOption = (id: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? { ...q, selectedId: id } : q));
  };

  // Question handlers
  const handlePromptChange = (prompt: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? { ...q, prompt } : q));
  };
  const handleSetCorrect = (id: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? { ...q, correctId: id } : q));
  };
  const handleSubmit = () => {
    setQuestions(prev => prev.map((q, idx) => idx === current ? {
      ...q,
      feedback: q.selectedId === q.correctId ? 'correct' : 'incorrect'
    } : q));
    setTimeout(() => {
      setQuestions(prev => prev.map((q, idx) => idx === current ? { ...q, feedback: null } : q));
    }, 1200);
  };
  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, blankQuestion()]);
    setCurrent(questions.length);
  };
  const handleDeleteQuestion = () => {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter((_, idx) => idx !== current));
    setCurrent(c => c > 0 ? c - 1 : 0);
  };
  const handlePrev = () => setCurrent(c => Math.max(0, c - 1));
  const handleNext = () => setCurrent(c => Math.min(questions.length - 1, c + 1));

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Quiz Header - Compact, lively, and visually appealing */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2 animate-fade-in">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487A9.001 9.001 0 013 12c0 4.97 4.03 9 9 9s9-4.03 9-9a9.001 9.001 0 00-4.138-7.513M15 9h.01M9 9h.01M8 13a4 4 0 008 0" /></svg>
          </span>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 text-center tracking-tight px-2"
            placeholder="Quiz Title"
            maxLength={60}
            style={{ minWidth: '120px', maxWidth: '320px' }}
          />
        </div>
        <input
          type="text"
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          className="w-full max-w-md text-base text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all placeholder-gray-400 text-center animate-fade-in"
          placeholder="Short description (optional)"
          maxLength={100}
        />
      </div>

      <ProgressBar current={current + 1} total={questions.length} />
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-12 py-10 w-full transition-all duration-300 border border-gray-100 dark:border-gray-700
        ${q.feedback === 'correct' ? 'border-green-500 ring-2 ring-green-200 animate-[glow-green_1s_ease]' : ''}
        ${q.feedback === 'incorrect' ? 'border-red-500 ring-2 ring-red-200 animate-[glow-red_1s_ease]' : ''}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-2"></span>
            Question
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 font-semibold shadow-sm transition-all"
            >Prev</button>
            <button
              onClick={handleNext}
              disabled={current === questions.length - 1}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 font-semibold shadow-sm transition-all"
            >Next</button>
            <button
              onClick={handleAddQuestion}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 font-semibold shadow-md transition-all"
            >+ Add Question</button>
            <button
              onClick={handleDeleteQuestion}
              disabled={questions.length === 1}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 font-semibold shadow-sm transition-all"
            >Delete</button>
          </div>
        </div>
        <div className="mb-6">
          <QuillEditor content={q.prompt} onChange={handlePromptChange} placeholder="Write your question..." />
        </div>
        <OptionList
          options={q.options}
          selectedId={q.selectedId}
          onSelect={handleSelectOption}
          onDelete={handleDeleteOption}
          onReorder={handleReorderOptions}
          onEdit={handleEditOption}
        />
        <button
          onClick={handleAddOption}
          className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-sm"
        >
          + Add Option
        </button>
        <div className="flex gap-3 mt-8 justify-center">
          {q.options.map((o: any, idx: number) => (
            <button
              key={o.id}
              onClick={() => handleSetCorrect(o.id)}
              className={`px-4 py-2 rounded-lg border text-base font-semibold transition-colors duration-150 shadow-sm
                ${q.correctId === o.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
              aria-label={`Mark option ${idx + 1} as correct`}
            >
              {q.correctId === o.id ? 'Correct' : 'Mark Correct'}
            </button>
          ))}
        </div>
        <button
          className="w-full mt-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold shadow-lg transition-transform duration-150 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={!q.selectedId}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <style jsx global>{`
        @keyframes glow-green {
          0% { box-shadow: 0 0 0 0 #22c55e33; }
          100% { box-shadow: 0 0 0 8px #22c55e00; }
        }
        @keyframes glow-red {
          0% { box-shadow: 0 0 0 0 #ef444433; }
          100% { box-shadow: 0 0 0 8px #ef444400; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 