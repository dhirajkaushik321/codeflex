'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  Play, 
  RotateCcw, 
  Trophy, 
  Zap,
  ArrowRight,
  ArrowLeft,
  Target,
  Flame
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'syntax' | 'functions' | 'objects' | 'arrays' | 'es6';
}

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  streak: number;
  correctAnswers: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  gameStartTime: number | null;
}

interface JavaScriptSyntaxRushProps {
  onGameComplete: (score: number, timeElapsed: number, correctAnswers: number) => void;
  onClose: () => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const questions: Question[] = [
  // Easy questions
  {
    id: 1,
    question: "What is the correct way to declare a variable in JavaScript?",
    options: [
      "var myVariable = 10;",
      "let myVariable = 10;",
      "const myVariable = 10;",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All three are valid ways to declare variables in JavaScript. 'var' is function-scoped, 'let' is block-scoped and can be reassigned, 'const' is block-scoped and cannot be reassigned.",
    difficulty: 'easy',
    category: 'syntax'
  },
  {
    id: 2,
    question: "How do you write a comment in JavaScript?",
    code: "// This is a comment\n/* This is also a comment */",
    options: [
      "<!-- This is a comment -->",
      "// This is a comment",
      "/* This is a comment */",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "JavaScript supports both single-line comments (//) and multi-line comments (/* */).",
    difficulty: 'easy',
    category: 'syntax'
  },
  {
    id: 3,
    question: "What is the result of: typeof null?",
    code: "typeof null",
    options: [
      "'null'",
      "'object'",
      "'undefined'",
      "'boolean'"
    ],
    correctAnswer: 1,
    explanation: "This is a famous JavaScript quirk. typeof null returns 'object', which is considered a bug in the language that has persisted for historical reasons.",
    difficulty: 'easy',
    category: 'syntax'
  },
  {
    id: 4,
    question: "How do you check if a variable is an array?",
    options: [
      "typeof arr === 'array'",
      "Array.isArray(arr)",
      "arr instanceof Array",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "Array.isArray() is the most reliable method, but instanceof Array also works in most cases. typeof returns 'object' for arrays.",
    difficulty: 'easy',
    category: 'arrays'
  },
  {
    id: 5,
    question: "What does the '===' operator do?",
    code: "5 === '5'",
    options: [
      "Compares value and type",
      "Compares only value",
      "Compares only type",
      "Assigns a value"
    ],
    correctAnswer: 0,
    explanation: "The === operator performs strict equality comparison, checking both value and type. In the example, 5 === '5' returns false because they are different types.",
    difficulty: 'easy',
    category: 'syntax'
  },
  // Medium questions
  {
    id: 6,
    question: "What is the output of this code?",
    code: "console.log(1 + '2' + '2');\nconsole.log(1 + +'2' + '2');\nconsole.log(1 + -'1' + '2');\nconsole.log(+'1' + '1' + '2');",
    options: [
      "'122', '32', '02', '112'",
      "'122', '122', '02', '112'",
      "'122', '32', '12', '112'",
      "'122', '32', '02', '122'"
    ],
    correctAnswer: 0,
    explanation: "The unary + operator converts strings to numbers. So +'2' becomes 2, and +'1' becomes 1. The - operator also converts to number and negates it.",
    difficulty: 'medium',
    category: 'syntax'
  },
  {
    id: 7,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that has access to variables in its outer scope",
      "A way to close browser windows",
      "A method to end loops",
      "A type of object"
    ],
    correctAnswer: 0,
    explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
    difficulty: 'medium',
    category: 'functions'
  },
  {
    id: 8,
    question: "What is the difference between 'let' and 'const'?",
    options: [
      "There is no difference",
      "let can be reassigned, const cannot",
      "const is faster than let",
      "let is block-scoped, const is function-scoped"
    ],
    correctAnswer: 1,
    explanation: "let allows reassignment of variables, while const creates read-only references. However, const objects can still have their properties modified.",
    difficulty: 'medium',
    category: 'syntax'
  },
  {
    id: 9,
    question: "What is the output?",
    code: "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr);",
    options: [
      "[1, 2, 3]",
      "[1, 2, 3, 4]",
      "Error: Cannot modify const array",
      "[4, 1, 2, 3]"
    ],
    correctAnswer: 1,
    explanation: "const prevents reassignment of the variable, but you can still modify the contents of arrays and objects.",
    difficulty: 'medium',
    category: 'arrays'
  },
  {
    id: 10,
    question: "What is the purpose of 'use strict'?",
    code: "'use strict';",
    options: [
      "Makes code run faster",
      "Enables strict mode for better error checking",
      "Forces all variables to be declared",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Strict mode enables better error checking, prevents certain actions, and disables confusing or poorly thought-out features.",
    difficulty: 'medium',
    category: 'syntax'
  },
  // Hard questions
  {
    id: 11,
    question: "What is the output of this Promise chain?",
    code: "Promise.resolve(1)\n  .then(x => { throw x; })\n  .then(x => console.log('then', x))\n  .catch(err => console.log('catch', err));",
    options: [
      "'then 1'",
      "'catch 1'",
      "Nothing (no output)",
      "Error thrown"
    ],
    correctAnswer: 1,
    explanation: "When a Promise throws an error, it skips all subsequent .then() handlers and goes directly to the .catch() handler.",
    difficulty: 'hard',
    category: 'functions'
  },
  {
    id: 12,
    question: "What is the difference between 'null' and 'undefined'?",
    options: [
      "There is no difference",
      "null is assigned, undefined is default",
      "undefined is assigned, null is default",
      "null is a type, undefined is a value"
    ],
    correctAnswer: 1,
    explanation: "null is an explicitly assigned value representing 'no value', while undefined is the default value for uninitialized variables.",
    difficulty: 'hard',
    category: 'syntax'
  },
  {
    id: 13,
    question: "What is the output?",
    code: "console.log(typeof typeof 1);",
    options: [
      "'number'",
      "'string'",
      "'object'",
      "'undefined'"
    ],
    correctAnswer: 1,
    explanation: "typeof 1 returns 'number' (a string), and typeof 'number' returns 'string'.",
    difficulty: 'hard',
    category: 'syntax'
  },
  {
    id: 14,
    question: "What is event bubbling?",
    options: [
      "Events bubble up from child to parent elements",
      "Events bubble down from parent to child elements",
      "Events create bubbles in the UI",
      "Events are stored in a bubble data structure"
    ],
    correctAnswer: 0,
    explanation: "Event bubbling is the process where an event triggers on the deepest target element, then bubbles up through its parent elements in the DOM tree.",
    difficulty: 'hard',
    category: 'syntax'
  },
  {
    id: 15,
    question: "What is the difference between '==' and '==='?",
    code: "console.log(0 == false);\nconsole.log(0 === false);",
    options: [
      "true, true",
      "true, false",
      "false, true",
      "false, false"
    ],
    correctAnswer: 1,
    explanation: "== performs type coercion, so 0 == false is true (both are falsy). === performs strict comparison, so 0 === false is false (different types).",
    difficulty: 'hard',
    category: 'syntax'
  }
];

export default function JavaScriptSyntaxRush({ onGameComplete, onClose, difficulty }: JavaScriptSyntaxRushProps) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 60,
    streak: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    selectedAnswer: null,
    showExplanation: false,
    gameStartTime: null,
  });

  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Filter questions based on difficulty
    const difficultyMap = {
      'beginner': 'easy',
      'intermediate': 'medium',
      'advanced': 'hard'
    };
    
    const filtered = questions.filter(q => q.difficulty === difficultyMap[difficulty]);
    setFilteredQuestions(filtered.slice(0, 10)); // Take 10 questions
  }, [difficulty]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft]);

  useEffect(() => {
    if (gameState.timeLeft === 0 && gameState.isPlaying) {
      endGame();
    }
  }, [gameState.timeLeft, gameState.isPlaying]);

  const startGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      currentQuestionIndex: 0,
      score: 0,
      timeLeft: 60,
      streak: 0,
      correctAnswers: 0,
      totalQuestions: filteredQuestions.length,
      selectedAnswer: null,
      showExplanation: false,
      gameStartTime: Date.now(),
    });
  }, [filteredQuestions.length]);

  const endGame = useCallback(() => {
    const timeElapsed = gameState.gameStartTime ? Date.now() - gameState.gameStartTime : 0;
    onGameComplete(gameState.score, timeElapsed, gameState.correctAnswers);
    setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
  }, [gameState.score, gameState.correctAnswers, gameState.gameStartTime, onGameComplete]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (gameState.selectedAnswer !== null || gameState.showExplanation) return;

    const currentQuestion = filteredQuestions[gameState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showExplanation: true,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      streak: isCorrect ? prev.streak + 1 : 0,
      score: isCorrect ? prev.score + (10 + prev.streak * 5) : prev.score,
    }));

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (gameState.currentQuestionIndex < filteredQuestions.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
          showExplanation: false,
        }));
      } else {
        endGame();
      }
    }, 2000);
  };

  const currentQuestion = filteredQuestions[gameState.currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Code className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Questions...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing your JavaScript challenge...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState.isPlaying && !gameState.isGameOver) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full mx-4"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              JavaScript Syntax Rush
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Test your JavaScript knowledge with timed multiple-choice questions!
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Game Rules:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 60 seconds to answer 10 questions</li>
                <li>• Correct answers earn points + streak bonus</li>
                <li>• Wrong answers reset your streak</li>
                <li>• Difficulty: {difficulty}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Game
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full mx-4"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Game Complete!
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{gameState.correctAnswers}/{gameState.totalQuestions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{gameState.streak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                JavaScript Syntax Rush
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Question {gameState.currentQuestionIndex + 1} of {gameState.totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-white">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-900 dark:text-white">{gameState.streak}</span>
            </div>
            <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-900 dark:text-white">{gameState.timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((gameState.currentQuestionIndex + 1) / gameState.totalQuestions) * 100}%` }}
            className="h-2 bg-yellow-500 rounded-full"
          />
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {currentQuestion.question}
          </h3>
          
          {currentQuestion.code && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
              <pre>{currentQuestion.code}</pre>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={gameState.selectedAnswer !== null}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                gameState.selectedAnswer === index
                  ? index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-600'
              } ${gameState.selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              whileHover={gameState.selectedAnswer === null ? { scale: 1.02 } : {}}
              whileTap={gameState.selectedAnswer === null ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  gameState.selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-gray-900 dark:text-white">{option}</span>
                {gameState.selectedAnswer === index && (
                  <div className="ml-auto">
                    {index === currentQuestion.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {gameState.showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
            >
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Explanation:
              </h4>
              <p className="text-blue-800 dark:text-blue-200">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Target className="w-4 h-4" />
            <span>Difficulty: {currentQuestion.difficulty}</span>
            <span>•</span>
            <span>Category: {currentQuestion.category}</span>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Exit Game
          </button>
        </div>
      </motion.div>
    </div>
  );
} 