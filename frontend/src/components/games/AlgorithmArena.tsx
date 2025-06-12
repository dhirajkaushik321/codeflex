'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  PauseCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Clock as ClockIcon
} from 'lucide-react';

interface AlgorithmStep {
  id: string;
  title: string;
  description: string;
  code: string;
  explanation: string;
  visualization: any;
  input: any;
  output: any;
  tips: string[];
}

interface AlgorithmLesson {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: number;
  learningObjectives: string[];
  steps: AlgorithmStep[];
  visualData: any;
}

interface LearningState {
  currentLessonIndex: number;
  currentStepIndex: number;
  progress: number;
  totalTimeSpent: number;
  showHint: boolean;
  isFullScreen: boolean;
  autoPlay: boolean;
  volume: boolean;
}

interface AlgorithmArenaProps {
  onClose: () => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const lessons: AlgorithmLesson[] = [
  {
    id: 1,
    title: "Bubble Sort Algorithm",
    subtitle: "Learn the fundamentals of sorting with step-by-step visualization",
    description: "Bubble Sort is one of the simplest sorting algorithms. It works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.",
    problem: "Sort the array [64, 34, 25, 12, 22, 11, 90] in ascending order using Bubble Sort algorithm.",
    difficulty: 'beginner',
    category: 'sorting',
    estimatedTime: 15,
    learningObjectives: [
      "Understand how Bubble Sort works",
      "Learn the step-by-step process",
      "Analyze time and space complexity",
      "Identify when to use Bubble Sort"
    ],
    steps: [
      {
        id: 'step1',
        title: "Understanding the Problem",
        description: "First, let's understand what we need to do",
        code: "// Goal: Sort array in ascending order\n// Input: [64, 34, 25, 12, 22, 11, 90]\n// Output: [11, 12, 22, 25, 34, 64, 90]",
        explanation: "We have an unsorted array and we need to arrange the numbers from smallest to largest. Bubble Sort will do this by comparing adjacent elements and swapping them if they're in the wrong order.",
        visualization: { type: 'problem', data: [64, 34, 25, 12, 22, 11, 90] },
        input: [64, 34, 25, 12, 22, 11, 90],
        output: [11, 12, 22, 25, 34, 64, 90],
        tips: ["Look at the first two numbers", "Which one is smaller?", "We want smaller numbers on the left"]
      },
      {
        id: 'step2',
        title: "First Pass - Compare and Swap",
        description: "Start comparing adjacent elements from the beginning",
        code: "// Compare 64 and 34\nif (arr[0] > arr[1]) {\n    swap(arr[0], arr[1]);\n}",
        explanation: "We start by comparing the first two elements: 64 and 34. Since 64 > 34, we swap them. Now our array becomes [34, 64, 25, 12, 22, 11, 90].",
        visualization: { type: 'comparison', indices: [0, 1], action: 'swap' },
        input: [64, 34, 25, 12, 22, 11, 90],
        output: [34, 64, 25, 12, 22, 11, 90],
        tips: ["64 is greater than 34", "In ascending order, smaller numbers come first", "So we swap them"]
      },
      {
        id: 'step3',
        title: "Continue First Pass",
        description: "Move to the next pair and continue comparing",
        code: "// Compare 64 and 25\nif (arr[1] > arr[2]) {\n    swap(arr[1], arr[2]);\n}",
        explanation: "Now we compare 64 and 25. Since 64 > 25, we swap them. The array becomes [34, 25, 64, 12, 22, 11, 90]. We continue this process for the entire array.",
        visualization: { type: 'comparison', indices: [1, 2], action: 'swap' },
        input: [34, 64, 25, 12, 22, 11, 90],
        output: [34, 25, 64, 12, 22, 11, 90],
        tips: ["Keep moving through the array", "Compare each pair", "Swap if the left number is larger"]
      },
      {
        id: 'step4',
        title: "Complete First Pass",
        description: "Finish the first complete pass through the array",
        code: "// After first pass\n// Largest element 'bubbles up' to the end\n// Array: [34, 25, 12, 22, 11, 64, 90]",
        explanation: "After completing the first pass, the largest element (90) has 'bubbled up' to its correct position at the end. Notice that 90 was already in the right place, so no swaps were needed for it.",
        visualization: { type: 'pass-complete', data: [34, 25, 12, 22, 11, 64, 90], sorted: [90] },
        input: [34, 25, 64, 12, 22, 11, 90],
        output: [34, 25, 12, 22, 11, 64, 90],
        tips: ["The largest number is now in the correct position", "We can ignore it in future passes", "This is why it's called 'bubbling up'"]
      },
      {
        id: 'step5',
        title: "Continue Until Sorted",
        description: "Keep making passes until no swaps are needed",
        code: "// Continue passes until no swaps occur\n// This means the array is fully sorted",
        explanation: "We continue making passes through the array until no swaps are needed in a complete pass. This indicates that the array is fully sorted. Each pass puts the next largest element in its correct position.",
        visualization: { type: 'final-result', data: [11, 12, 22, 25, 34, 64, 90], sorted: true },
        input: [25, 12, 22, 11, 34, 64, 90],
        output: [11, 12, 22, 25, 34, 64, 90],
        tips: ["The algorithm stops when no swaps are needed", "This means everything is in order", "The array is now sorted!"]
      }
    ],
    visualData: {
      type: 'bubble-sort',
      data: [64, 34, 25, 12, 22, 11, 90],
      currentStep: 0
    }
  }
];

export default function AlgorithmArena({ onClose, difficulty }: AlgorithmArenaProps) {
  const [learningState, setLearningState] = useState<LearningState>({
    currentLessonIndex: 0,
    currentStepIndex: 0,
    progress: 0,
    totalTimeSpent: 0,
    showHint: false,
    isFullScreen: true,
    autoPlay: false,
    volume: true
  });

  const [filteredLessons, setFilteredLessons] = useState<AlgorithmLesson[]>([]);

  useEffect(() => {
    const difficultyMap = {
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };
    
    let filtered = lessons.filter(l => l.difficulty === difficultyMap[difficulty]);
    
    if (filtered.length === 0) {
      filtered = lessons;
    }
    
    setFilteredLessons(filtered);
  }, [difficulty]);

  const currentLesson = filteredLessons[learningState.currentLessonIndex];
  const currentStep = currentLesson?.steps[learningState.currentStepIndex];

  const nextStep = () => {
    if (currentStep) {
      setLearningState(prev => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex + 1,
        progress: ((prev.currentStepIndex + 1) / currentLesson.steps.length) * 100
      }));
    }
  };

  const prevStep = () => {
    if (learningState.currentStepIndex > 0) {
      setLearningState(prev => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1,
        progress: ((prev.currentStepIndex - 1) / currentLesson.steps.length) * 100
      }));
    }
  };

  const renderVisualization = () => {
    if (!currentStep) return null;

    const { visualization, input, output } = currentStep;

    switch (visualization.type) {
      case 'problem':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Problem Visualization
            </h3>
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Input Array</h4>
                <div className="flex gap-3 justify-center">
                  {input.map((value: number, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-16 h-16 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg"
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-4xl text-gray-400"
              >
                ↓
              </motion.div>
              
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Output</h4>
                <div className="flex gap-3 justify-center">
                  {output.map((value: number, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="w-16 h-16 bg-green-500 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg"
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Comparison Step
            </h3>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex gap-3 justify-center">
                {currentLesson.visualData.data.map((value: number, index: number) => (
                  <motion.div
                    key={index}
                    className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-300 ${
                      visualization.indices.includes(index)
                        ? 'bg-blue-500 text-white scale-110 ring-4 ring-blue-300'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    {value}
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Comparing elements at positions {visualization.indices.join(' and ')}
                </p>
                {visualization.action === 'swap' && (
                  <p className="text-red-600 dark:text-red-400 font-semibold mt-2">
                    Swapping required!
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-900/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Algorithm Visualization
            </h3>
            <div className="text-center text-gray-600 dark:text-gray-400">
              Interactive visualization coming soon...
            </div>
          </div>
        );
    }
  };

  if (!currentLesson) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Lessons...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing your algorithm learning experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Algorithm Learning Hub
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentLesson.title} • Step {learningState.currentStepIndex + 1} of {currentLesson.steps.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm">
              <ClockIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {Math.floor(learningState.totalTimeSpent / 60)}:{(learningState.totalTimeSpent % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLearningState(prev => ({ ...prev, showHint: !prev.showHint }))}
                className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setLearningState(prev => ({ ...prev, isFullScreen: !prev.isFullScreen }))}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {learningState.isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - Lesson Content */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Lesson Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  currentLesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  currentLesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentLesson.difficulty}
                </div>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold">
                  {currentLesson.category}
                </div>
                <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm font-semibold">
                  {currentLesson.estimatedTime} min
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLesson.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentLesson.subtitle}
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Learning Objectives:</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  {currentLesson.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Current Step */}
            {currentStep && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentStep.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {learningState.currentStepIndex + 1} / {currentLesson.steps.length}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {currentStep.description}
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Code Example:</h4>
                  <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                    <code>{currentStep.code}</code>
                  </pre>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Explanation:</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {currentStep.explanation}
                  </p>
                </div>
                
                {learningState.showHint && currentStep.tips && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">💡 Tips:</h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                      {currentStep.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Visualization */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(learningState.progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${learningState.progress}%` }}
                  className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>

            {/* Visualization */}
            {renderVisualization()}

            {/* Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={learningState.currentStepIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLearningState(prev => ({ ...prev, autoPlay: !prev.autoPlay }))}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {learningState.autoPlay ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={() => setLearningState(prev => ({ ...prev, volume: !prev.volume }))}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {learningState.volume ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
                
                <button
                  onClick={nextStep}
                  disabled={learningState.currentStepIndex === currentLesson.steps.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 