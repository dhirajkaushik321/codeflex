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
      {/* Quiz Header */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 w-full mb-3"
          placeholder="Quiz Title"
        />
        <QuillEditor
          content={quizDescription}
          onChange={setQuizDescription}
          placeholder="Quiz description..."
          className="min-h-[100px]"
        />
      </div>

      <ProgressBar current={current + 1} total={questions.length} />
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md px-10 py-8 w-full transition-all duration-300
        ${q.feedback === 'correct' ? 'border-green-500 ring-2 ring-green-200 animate-[glow-green_1s_ease]' : ''}
        ${q.feedback === 'incorrect' ? 'border-red-500 ring-2 ring-red-200 animate-[glow-red_1s_ease]' : ''}
      `}>
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">Question</div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            >Prev</button>
            <button
              onClick={handleNext}
              disabled={current === questions.length - 1}
              className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            >Next</button>
            <button
              onClick={handleAddQuestion}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >+ Add Question</button>
            <button
              onClick={handleDeleteQuestion}
              disabled={questions.length === 1}
              className="px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50"
            >Delete</button>
          </div>
        </div>
        <QuillEditor content={q.prompt} onChange={handlePromptChange} placeholder="Write your question..." />
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
          className="w-full mt-4 py-2 rounded-md border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 font-medium"
        >
          + Add Option
        </button>
        <div className="flex gap-2 mt-6">
          {q.options.map((o: any, idx: number) => (
            <button
              key={o.id}
              onClick={() => handleSetCorrect(o.id)}
              className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-150
                ${q.correctId === o.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
              aria-label={`Mark option ${idx + 1} as correct`}
            >
              {q.correctId === o.id ? 'Correct' : 'Mark Correct'}
            </button>
          ))}
        </div>
        <button
          className="w-full mt-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-semibold shadow-md transition-transform duration-150 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
      `}</style>
    </div>
  );
} 