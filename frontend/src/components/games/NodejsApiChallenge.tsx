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
  Rocket,
  GripVertical,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Lightbulb,
  Server,
  Database,
  Globe,
  FileText
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: any;
  responseBody?: any;
  statusCode: number;
  headers?: { [key: string]: string };
  isRequired: boolean;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  scenario: string;
  requiredEndpoints: ApiEndpoint[];
  availableEndpoints: ApiEndpoint[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  explanation: string;
  testCases: TestCase[];
}

interface TestCase {
  id: string;
  method: string;
  path: string;
  body?: any;
  expectedStatus: number;
  expectedResponse?: any;
  description: string;
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
  playerEndpoints: ApiEndpoint[];
  testResults: { [key: string]: boolean };
}

interface NodejsApiChallengeProps {
  onGameComplete: (score: number, timeElapsed: number, correctAnswers: number) => void;
  onClose: () => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const challenges: Challenge[] = [
  // Easy challenges
  {
    id: 1,
    title: "Basic User API",
    description: "Create a simple user management API with CRUD operations",
    scenario: "You're building a user management system for a small application. Create the basic endpoints to handle user operations.",
    timeLimit: 120,
    difficulty: 'easy',
    hints: [
      "Start with a GET endpoint to retrieve users",
      "Add a POST endpoint to create new users",
      "Include proper status codes (200, 201, 404)"
    ],
    explanation: "A basic user API should support CRUD operations with appropriate HTTP methods and status codes.",
    requiredEndpoints: [
      {
        id: 'get-users',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        statusCode: 200,
        isRequired: true
      },
      {
        id: 'create-user',
        method: 'POST',
        path: '/api/users',
        description: 'Create a new user',
        statusCode: 201,
        isRequired: true
      },
      {
        id: 'get-user',
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get a specific user by ID',
        statusCode: 200,
        isRequired: true
      }
    ],
    availableEndpoints: [
      { id: 'get-users', method: 'GET', path: '/api/users', description: 'Get all users', statusCode: 200 },
      { id: 'create-user', method: 'POST', path: '/api/users', description: 'Create a new user', statusCode: 201 },
      { id: 'get-user', method: 'GET', path: '/api/users/:id', description: 'Get a specific user by ID', statusCode: 200 },
      { id: 'update-user', method: 'PUT', path: '/api/users/:id', description: 'Update a user', statusCode: 200 },
      { id: 'delete-user', method: 'DELETE', path: '/api/users/:id', description: 'Delete a user', statusCode: 204 },
      { id: 'get-posts', method: 'GET', path: '/api/posts', description: 'Get all posts', statusCode: 200 }
    ],
    testCases: [
      {
        id: 'test1',
        method: 'GET',
        path: '/api/users',
        expectedStatus: 200,
        description: 'Should return all users'
      },
      {
        id: 'test2',
        method: 'POST',
        path: '/api/users',
        body: { name: 'John Doe', email: 'john@example.com' },
        expectedStatus: 201,
        description: 'Should create a new user'
      },
      {
        id: 'test3',
        method: 'GET',
        path: '/api/users/1',
        expectedStatus: 200,
        description: 'Should return user with ID 1'
      }
    ]
  },
  {
    id: 2,
    title: "Todo List API",
    description: "Build a todo list API with task management",
    scenario: "Create an API for managing todo items. Users should be able to create, read, update, and delete tasks.",
    timeLimit: 150,
    difficulty: 'easy',
    hints: [
      "Use POST to create new todos",
      "Use GET to retrieve todos",
      "Use PUT to update existing todos",
      "Use DELETE to remove todos"
    ],
    explanation: "A todo API should support full CRUD operations with proper validation and status codes.",
    requiredEndpoints: [
      {
        id: 'get-todos',
        method: 'GET',
        path: '/api/todos',
        description: 'Get all todos',
        statusCode: 200,
        isRequired: true
      },
      {
        id: 'create-todo',
        method: 'POST',
        path: '/api/todos',
        description: 'Create a new todo',
        statusCode: 201,
        isRequired: true
      },
      {
        id: 'update-todo',
        method: 'PUT',
        path: '/api/todos/:id',
        description: 'Update a todo',
        statusCode: 200,
        isRequired: true
      },
      {
        id: 'delete-todo',
        method: 'DELETE',
        path: '/api/todos/:id',
        description: 'Delete a todo',
        statusCode: 204,
        isRequired: true
      }
    ],
    availableEndpoints: [
      { id: 'get-todos', method: 'GET', path: '/api/todos', description: 'Get all todos', statusCode: 200 },
      { id: 'create-todo', method: 'POST', path: '/api/todos', description: 'Create a new todo', statusCode: 201 },
      { id: 'update-todo', method: 'PUT', path: '/api/todos/:id', description: 'Update a todo', statusCode: 200 },
      { id: 'delete-todo', method: 'DELETE', path: '/api/todos/:id', description: 'Delete a todo', statusCode: 204 },
      { id: 'get-todo', method: 'GET', path: '/api/todos/:id', description: 'Get a specific todo', statusCode: 200 },
      { id: 'get-users', method: 'GET', path: '/api/users', description: 'Get all users', statusCode: 200 }
    ],
    testCases: [
      {
        id: 'test1',
        method: 'GET',
        path: '/api/todos',
        expectedStatus: 200,
        description: 'Should return all todos'
      },
      {
        id: 'test2',
        method: 'POST',
        path: '/api/todos',
        body: { title: 'Learn Node.js', completed: false },
        expectedStatus: 201,
        description: 'Should create a new todo'
      },
      {
        id: 'test3',
        method: 'PUT',
        path: '/api/todos/1',
        body: { title: 'Learn Node.js', completed: true },
        expectedStatus: 200,
        description: 'Should update todo with ID 1'
      },
      {
        id: 'test4',
        method: 'DELETE',
        path: '/api/todos/1',
        expectedStatus: 204,
        description: 'Should delete todo with ID 1'
      }
    ]
  },
  // Medium challenges
  {
    id: 3,
    title: "Authentication API",
    description: "Create an authentication system with JWT tokens",
    scenario: "Build an authentication API that handles user registration, login, and protected routes using JWT tokens.",
    timeLimit: 180,
    difficulty: 'medium',
    hints: [
      "Use POST for registration and login",
      "Include JWT token in response headers",
      "Add middleware for protected routes",
      "Use proper error status codes (400, 401, 403)"
    ],
    explanation: "Authentication APIs require proper security measures, JWT token handling, and middleware for protected routes.",
    requiredEndpoints: [
      {
        id: 'register',
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user',
        statusCode: 201,
        isRequired: true
      },
      {
        id: 'login',
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login user and return JWT token',
        statusCode: 200,
        isRequired: true
      },
      {
        id: 'protected',
        method: 'GET',
        path: '/api/protected',
        description: 'Access protected route with JWT',
        statusCode: 200,
        isRequired: true
      },
      {
        id: 'logout',
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Logout user and invalidate token',
        statusCode: 200,
        isRequired: true
      }
    ],
    availableEndpoints: [
      { id: 'register', method: 'POST', path: '/api/auth/register', description: 'Register a new user', statusCode: 201 },
      { id: 'login', method: 'POST', path: '/api/auth/login', description: 'Login user and return JWT token', statusCode: 200 },
      { id: 'protected', method: 'GET', path: '/api/protected', description: 'Access protected route with JWT', statusCode: 200 },
      { id: 'logout', method: 'POST', path: '/api/auth/logout', description: 'Logout user and invalidate token', statusCode: 200 },
      { id: 'refresh', method: 'POST', path: '/api/auth/refresh', description: 'Refresh JWT token', statusCode: 200 },
      { id: 'profile', method: 'GET', path: '/api/profile', description: 'Get user profile', statusCode: 200 }
    ],
    testCases: [
      {
        id: 'test1',
        method: 'POST',
        path: '/api/auth/register',
        body: { username: 'testuser', email: 'test@example.com', password: 'password123' },
        expectedStatus: 201,
        description: 'Should register a new user'
      },
      {
        id: 'test2',
        method: 'POST',
        path: '/api/auth/login',
        body: { email: 'test@example.com', password: 'password123' },
        expectedStatus: 200,
        description: 'Should login and return JWT token'
      },
      {
        id: 'test3',
        method: 'GET',
        path: '/api/protected',
        expectedStatus: 200,
        description: 'Should access protected route with valid JWT'
      }
    ]
  }
];

export default function NodejsApiChallenge({ onGameComplete, onClose, difficulty }: NodejsApiChallengeProps) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentChallengeIndex: 0,
    score: 0,
    timeLeft: 120,
    streak: 0,
    correctAnswers: 0,
    totalChallenges: 0,
    showHint: false,
    showPreview: false,
    gameStartTime: null,
    playerEndpoints: [],
    testResults: {}
  });

  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [availableEndpoints, setAvailableEndpoints] = useState<ApiEndpoint[]>([]);

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
      setAvailableEndpoints([...currentChallenge.availableEndpoints]);
      setGameState(prev => ({
        ...prev,
        timeLeft: currentChallenge.timeLimit,
        totalChallenges: filteredChallenges.length,
        playerEndpoints: [],
        testResults: {}
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
      timeLeft: filteredChallenges[0]?.timeLimit || 120,
      streak: 0,
      correctAnswers: 0,
      totalChallenges: filteredChallenges.length,
      showHint: false,
      showPreview: false,
      gameStartTime: Date.now(),
      playerEndpoints: [],
      testResults: {}
    });
  }, [filteredChallenges]);

  const endGame = useCallback(() => {
    const timeElapsed = gameState.gameStartTime ? Date.now() - gameState.gameStartTime : 0;
    onGameComplete(gameState.score, timeElapsed, gameState.correctAnswers);
    setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
  }, [gameState.score, gameState.correctAnswers, gameState.gameStartTime, onGameComplete]);

  const addEndpoint = (endpoint: ApiEndpoint) => {
    setGameState(prev => ({
      ...prev,
      playerEndpoints: [...prev.playerEndpoints, { ...endpoint, id: `${endpoint.id}-${Date.now()}` }]
    }));
    setAvailableEndpoints(prev => prev.filter(e => e.id !== endpoint.id));
  };

  const removeEndpoint = (endpointId: string) => {
    const endpoint = gameState.playerEndpoints.find(e => e.id === endpointId);
    if (endpoint) {
      setGameState(prev => ({
        ...prev,
        playerEndpoints: prev.playerEndpoints.filter(e => e.id !== endpointId)
      }));
      setAvailableEndpoints(prev => [...prev, { ...endpoint, id: endpoint.id.split('-')[0] }]);
    }
  };

  const runTests = () => {
    const currentChallenge = filteredChallenges[gameState.currentChallengeIndex];
    const testResults: { [key: string]: boolean } = {};
    let correctTests = 0;

    currentChallenge.testCases.forEach(testCase => {
      const matchingEndpoint = gameState.playerEndpoints.find(endpoint => 
        endpoint.method === testCase.method && 
        endpoint.path === testCase.path &&
        endpoint.statusCode === testCase.expectedStatus
      );
      
      const isCorrect = !!matchingEndpoint;
      testResults[testCase.id] = isCorrect;
      if (isCorrect) correctTests++;
    });

    const allTestsPassed = correctTests === currentChallenge.testCases.length;
    
    if (allTestsPassed) {
      setGameState(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        streak: prev.streak + 1,
        score: prev.score + (100 + prev.streak * 20),
        testResults
      }));

      // Auto-advance after 3 seconds
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
      }, 3000);
    } else {
      setGameState(prev => ({
        ...prev,
        streak: 0,
        testResults
      }));
    }
  };

  const renderEndpoint = (endpoint: ApiEndpoint, isDraggable = true) => {
    const methodColors = {
      'GET': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'POST': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'PUT': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'PATCH': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    };

    return (
      <motion.div
        key={endpoint.id}
        layout
        className={`flex items-center gap-3 p-3 border rounded-lg ${
          isDraggable 
            ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' 
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
        }`}
        whileHover={isDraggable ? { scale: 1.02 } : {}}
        whileTap={isDraggable ? { scale: 0.98 } : {}}
        onClick={isDraggable ? () => addEndpoint(endpoint) : undefined}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
        <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <div className="flex-1">
          <div className="font-mono text-sm text-gray-900 dark:text-white">{endpoint.path}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{endpoint.description}</div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {endpoint.statusCode}
        </div>
        {!isDraggable && (
          <button
            onClick={() => removeEndpoint(endpoint.id)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    );
  };

  const renderTestCase = (testCase: TestCase) => {
    const isPassed = gameState.testResults[testCase.id];
    
    return (
      <div key={testCase.id} className={`p-3 border rounded-lg ${
        isPassed === true ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600' :
        isPassed === false ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600' :
        'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            testCase.method === 'GET' ? 'bg-green-100 text-green-800' :
            testCase.method === 'POST' ? 'bg-blue-100 text-blue-800' :
            testCase.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {testCase.method}
          </span>
          <span className="font-mono text-sm">{testCase.path}</span>
          <span className="text-xs text-gray-500">→ {testCase.expectedStatus}</span>
          {isPassed === true && <CheckCircle className="w-4 h-4 text-green-500" />}
          {isPassed === false && <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{testCase.description}</p>
      </div>
    );
  };

  const currentChallenge = filteredChallenges[gameState.currentChallengeIndex];

  if (!currentChallenge) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Server className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Challenges...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing your Node.js API challenges...
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
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Server className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Node.js API Challenge
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Build REST APIs by creating endpoints and handling requests!
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Game Rules:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Drag endpoints to build your API</li>
                <li>• Match the required endpoints exactly</li>
                <li>• Run tests to validate your API</li>
                <li>• Difficulty: {difficulty}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Game Complete!
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{gameState.score}</div>
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
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
        className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Node.js API Challenge
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
            className="h-2 bg-emerald-500 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Challenge and Available Endpoints */}
          <div className="space-y-6">
            {/* Challenge Description */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {currentChallenge.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentChallenge.description}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 mb-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Scenario:</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">{currentChallenge.scenario}</p>
              </div>
              
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

            {/* Available Endpoints */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Available Endpoints
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableEndpoints.map((endpoint) => renderEndpoint(endpoint, true))}
              </div>
            </div>
          </div>

          {/* Middle Column - Player's API */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your API Endpoints
              </h3>
              <button
                onClick={runTests}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Run Tests
              </button>
            </div>

            <div className="min-h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              {gameState.playerEndpoints.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>Drag endpoints here to build your API</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {gameState.playerEndpoints.map((endpoint) => renderEndpoint(endpoint, false))}
                </div>
              )}
            </div>

            {/* Required Endpoints Preview */}
            {gameState.showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Required Endpoints:</h4>
                <div className="space-y-2">
                  {currentChallenge.requiredEndpoints.map((endpoint) => renderEndpoint(endpoint, false))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Test Cases */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Test Cases
            </h3>
            
            <div className="space-y-3">
              {currentChallenge.testCases.map((testCase) => renderTestCase(testCase))}
            </div>

            {/* Test Results Summary */}
            {Object.keys(gameState.testResults).length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Test Results:</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.values(gameState.testResults).filter(Boolean).length} passed
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.values(gameState.testResults).filter(r => !r).length} failed
                    </span>
                  </div>
                </div>
              </div>
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