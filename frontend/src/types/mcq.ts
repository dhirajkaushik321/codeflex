export interface MCQOption {
  id: string;
  content: string; // Rich text content (HTML)
  isCorrect: boolean;
  order: number;
  explanation?: string;
}

export interface MCQQuestion {
  id: string;
  prompt: string; // Rich text content (HTML)
  options: MCQOption[];
  type: 'single-select' | 'multi-select';
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hint?: string;
  explanation?: string;
  timeLimit?: number; // in seconds
  tags: string[];
  order: number;
}

export interface MCQQuiz {
  id: string;
  title: string;
  description: string;
  questions: MCQQuestion[];
  settings: MCQQuizSettings;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface MCQQuizSettings {
  shuffleOptions: boolean;
  timeLimit?: number; // in minutes
  maxAttempts?: number;
  showHints: boolean;
  showExplanations: boolean;
  allowReview: boolean;
  passingScore: number; // percentage
  pointsPerQuestion: number;
}

export interface MCQSubmission {
  quizId: string;
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
  timeSpent: number; // in seconds
  pointsEarned: number;
}

export interface MCQProgress {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  timeElapsed: number;
  submissions: MCQSubmission[];
} 