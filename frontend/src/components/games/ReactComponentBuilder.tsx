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
  Flame,
  Puzzle,
  GripVertical,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Lightbulb
} from 'lucide-react';

interface ComponentElement {
  id: string;
  type: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'button' | 'input' | 'img' | 'ul' | 'li' | 'span' | 'a';
  content: string;
  props: { [key: string]: string };
  children?: ComponentElement[];
  isRequired?: boolean;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  targetStructure: ComponentElement[];
  availableElements: ComponentElement[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  explanation: string;
}

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  currentChallengeIndex: number;
  score: number;
  timeLeft: number;
  streak: number;
  correctAnswers: number;
  totalChallenges: number;
  showHint: boolean;
  showPreview: boolean;
  gameStartTime: number | null;
}

interface ReactComponentBuilderProps {
  onGameComplete: (score: number, timeElapsed: number, correctAnswers: number) => void;
  onClose: () => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const challenges: Challenge[] = [
  // Easy challenges
  {
    id: 1,
    title: "Simple Header Component",
    description: "Create a header component with a title and subtitle",
    timeLimit: 90,
    difficulty: 'easy',
    hints: [
      "Start with an h1 element for the main title",
      "Add an h2 element for the subtitle",
      "Wrap them in a div container"
    ],
    explanation: "A basic header component typically contains a main title (h1) and a subtitle (h2) wrapped in a container div.",
    targetStructure: [
      {
        id: 'container',
        type: 'div',
        content: '',
        props: { className: 'header' },
        children: [
          {
            id: 'title',
            type: 'h1',
            content: 'Welcome to React',
            props: {},
            isRequired: true
          },
          {
            id: 'subtitle',
            type: 'h2',
            content: 'Build amazing components',
            props: {},
            isRequired: true
          }
        ]
      }
    ],
    availableElements: [
      { id: 'div1', type: 'div', content: '', props: { className: 'header' } },
      { id: 'h1', type: 'h1', content: 'Welcome to React', props: {} },
      { id: 'h2', type: 'h2', content: 'Build amazing components', props: {} },
      { id: 'p', type: 'p', content: 'This is a paragraph', props: {} },
      { id: 'span', type: 'span', content: 'Inline text', props: {} }
    ]
  },
  {
    id: 2,
    title: "Button with Icon",
    description: "Create a button component with text and an icon",
    timeLimit: 75,
    difficulty: 'easy',
    hints: [
      "Use a button element as the container",
      "Add a span for the icon",
      "Add another span for the text"
    ],
    explanation: "Buttons often contain both icons and text. The icon and text should be wrapped in spans for proper styling.",
    targetStructure: [
      {
        id: 'button',
        type: 'button',
        content: '',
        props: { className: 'btn-primary' },
        children: [
          {
            id: 'icon',
            type: 'span',
            content: '⭐',
            props: { className: 'icon' },
            isRequired: true
          },
          {
            id: 'text',
            type: 'span',
            content: 'Click me',
            props: { className: 'text' },
            isRequired: true
          }
        ]
      }
    ],
    availableElements: [
      { id: 'button', type: 'button', content: '', props: { className: 'btn-primary' } },
      { id: 'span1', type: 'span', content: '⭐', props: { className: 'icon' } },
      { id: 'span2', type: 'span', content: 'Click me', props: { className: 'text' } },
      { id: 'div', type: 'div', content: 'Container', props: {} },
      { id: 'p', type: 'p', content: 'Paragraph', props: {} }
    ]
  },
  // Medium challenges
  {
    id: 3,
    title: "Navigation Menu",
    description: "Build a navigation menu with multiple links",
    timeLimit: 120,
    difficulty: 'medium',
    hints: [
      "Start with a nav container",
      "Add an unordered list (ul) for the menu items",
      "Each menu item should be a list item (li) with an anchor (a)"
    ],
    explanation: "Navigation menus typically use semantic HTML with nav, ul, li, and a elements for proper accessibility and structure.",
    targetStructure: [
      {
        id: 'nav',
        type: 'nav',
        content: '',
        props: { className: 'navbar' },
        children: [
          {
            id: 'ul',
            type: 'ul',
            content: '',
            props: { className: 'nav-list' },
            children: [
              {
                id: 'li1',
                type: 'li',
                content: '',
                props: {},
                children: [
                  {
                    id: 'a1',
                    type: 'a',
                    content: 'Home',
                    props: { href: '/' },
                    isRequired: true
                  }
                ],
                isRequired: true
              },
              {
                id: 'li2',
                type: 'li',
                content: '',
                props: {},
                children: [
                  {
                    id: 'a2',
                    type: 'a',
                    content: 'About',
                    props: { href: '/about' },
                    isRequired: true
                  }
                ],
                isRequired: true
              }
            ],
            isRequired: true
          }
        ]
      }
    ],
    availableElements: [
      { id: 'nav', type: 'nav', content: '', props: { className: 'navbar' } },
      { id: 'ul', type: 'ul', content: '', props: { className: 'nav-list' } },
      { id: 'li1', type: 'li', content: '', props: {} },
      { id: 'li2', type: 'li', content: '', props: {} },
      { id: 'a1', type: 'a', content: 'Home', props: { href: '/' } },
      { id: 'a2', type: 'a', content: 'About', props: { href: '/about' } },
      { id: 'div', type: 'div', content: 'Container', props: {} },
      { id: 'span', type: 'span', content: 'Text', props: {} }
    ]
  }
];

export default function ReactComponentBuilder({ onGameComplete, onClose, difficulty }: ReactComponentBuilderProps) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentChallengeIndex: 0,
    score: 0,
    timeLeft: 90,
    streak: 0,
    correctAnswers: 0,
    totalChallenges: 0,
    showHint: false,
    showPreview: false,
    gameStartTime: null,
  });

  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [playerStructure, setPlayerStructure] = useState<ComponentElement[]>([]);
  const [availableElements, setAvailableElements] = useState<ComponentElement[]>([]);

  useEffect(() => {
    // Filter challenges based on difficulty
    const difficultyMap = {
      'beginner': 'easy',
      'intermediate': 'medium',
      'advanced': 'hard'
    };
    
    const filtered = challenges.filter(c => c.difficulty === difficultyMap[difficulty]);
    setFilteredChallenges(filtered.slice(0, 3)); // Take 3 challenges
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

  useEffect(() => {
    if (filteredChallenges.length > 0 && gameState.currentChallengeIndex < filteredChallenges.length) {
      const currentChallenge = filteredChallenges[gameState.currentChallengeIndex];
      setAvailableElements([...currentChallenge.availableElements]);
      setPlayerStructure([]);
      setGameState(prev => ({
        ...prev,
        timeLeft: currentChallenge.timeLimit,
        totalChallenges: filteredChallenges.length
      }));
    }
  }, [filteredChallenges, gameState.currentChallengeIndex]);

  const startGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      currentChallengeIndex: 0,
      score: 0,
      timeLeft: filteredChallenges[0]?.timeLimit || 90,
      streak: 0,
      correctAnswers: 0,
      totalChallenges: filteredChallenges.length,
      showHint: false,
      showPreview: false,
      gameStartTime: Date.now(),
    });
  }, [filteredChallenges]);

  const endGame = useCallback(() => {
    const timeElapsed = gameState.gameStartTime ? Date.now() - gameState.gameStartTime : 0;
    onGameComplete(gameState.score, timeElapsed, gameState.correctAnswers);
    setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
  }, [gameState.score, gameState.correctAnswers, gameState.gameStartTime, onGameComplete]);

  const addElementToStructure = (element: ComponentElement) => {
    setPlayerStructure(prev => [...prev, { ...element, id: `${element.id}-${Date.now()}` }]);
    setAvailableElements(prev => prev.filter(e => e.id !== element.id));
  };

  const removeElementFromStructure = (elementId: string) => {
    const element = playerStructure.find(e => e.id === elementId);
    if (element) {
      setPlayerStructure(prev => prev.filter(e => e.id !== elementId));
      setAvailableElements(prev => [...prev, { ...element, id: element.id.split('-')[0] }]);
    }
  };

  const checkSolution = () => {
    const currentChallenge = filteredChallenges[gameState.currentChallengeIndex];
    const isCorrect = compareStructures(playerStructure, currentChallenge.targetStructure);
    
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        streak: prev.streak + 1,
        score: prev.score + (50 + prev.streak * 10),
      }));

      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (gameState.currentChallengeIndex < filteredChallenges.length - 1) {
          setGameState(prev => ({
            ...prev,
            currentChallengeIndex: prev.currentChallengeIndex + 1,
            showHint: false,
            showPreview: false,
          }));
        } else {
          endGame();
        }
      }, 2000);
    } else {
      setGameState(prev => ({
        ...prev,
        streak: 0,
      }));
    }
  };

  const compareStructures = (player: ComponentElement[], target: ComponentElement[]): boolean => {
    // Simple comparison - in a real implementation, this would be more sophisticated
    return player.length === target.length && 
           player.every((p, i) => p.type === target[i].type);
  };

  const renderElement = (element: ComponentElement, isDraggable = true) => {
    const ElementTag = element.type as any;
    
    return (
      <motion.div
        key={element.id}
        layout
        className={`flex items-center gap-2 p-2 border rounded-lg ${
          isDraggable 
            ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' 
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
        }`}
        whileHover={isDraggable ? { scale: 1.02 } : {}}
        whileTap={isDraggable ? { scale: 0.98 } : {}}
        onClick={isDraggable ? () => addElementToStructure(element) : undefined}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
        <ElementTag {...element.props}>
          {element.content}
          {element.children && element.children.map(child => renderElement(child, false))}
        </ElementTag>
        {!isDraggable && (
          <button
            onClick={() => removeElementFromStructure(element.id)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    );
  };

  const currentChallenge = filteredChallenges[gameState.currentChallengeIndex];

  if (!currentChallenge) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Puzzle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Challenges...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing your React component challenges...
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
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Puzzle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              React Component Builder
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Build React components by dragging and dropping elements!
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Game Rules:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Drag elements to build the target component</li>
                <li>• Match the structure exactly to earn points</li>
                <li>• Use hints if you get stuck</li>
                <li>• Difficulty: {difficulty}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Game Complete!
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{gameState.correctAnswers}/{gameState.totalChallenges}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{Math.round((gameState.correctAnswers / gameState.totalChallenges) * 100)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{gameState.streak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
        className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Puzzle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                React Component Builder
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Challenge {gameState.currentChallengeIndex + 1} of {gameState.totalChallenges}
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
            animate={{ width: `${((gameState.currentChallengeIndex + 1) / gameState.totalChallenges) * 100}%` }}
            className="h-2 bg-blue-500 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Challenge and Available Elements */}
          <div className="space-y-6">
            {/* Challenge Description */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {currentChallenge.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentChallenge.description}
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, showHint: !prev.showHint }))}
                  className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded text-sm"
                >
                  <Lightbulb className="w-4 h-4" />
                  Hint
                </button>
                <button
                  onClick={() => setGameState(prev => ({ ...prev, showPreview: !prev.showPreview }))}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded text-sm"
                >
                  {gameState.showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Preview
                </button>
              </div>

              {gameState.showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"
                >
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Hint:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {currentChallenge.hints.map((hint, index) => (
                      <li key={index}>• {hint}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Available Elements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Available Elements
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableElements.map((element) => renderElement(element, true))}
              </div>
            </div>
          </div>

          {/* Right Column - Player's Structure */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Component Structure
              </h3>
              <button
                onClick={checkSolution}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Check Solution
              </button>
            </div>

            <div className="min-h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              {playerStructure.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>Drag elements here to build your component</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {playerStructure.map((element) => renderElement(element, false))}
                </div>
              )}
            </div>

            {/* Target Structure Preview */}
            {gameState.showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Target Structure:</h4>
                <div className="space-y-2">
                  {currentChallenge.targetStructure.map((element) => renderElement(element, false))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Target className="w-4 h-4" />
            <span>Difficulty: {currentChallenge.difficulty}</span>
            <span>•</span>
            <span>Time Limit: {currentChallenge.timeLimit}s</span>
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