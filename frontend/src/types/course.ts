export interface Page {
  id: string;
  title: string;
  content: string;
  order: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // in minutes
  points?: number;
  tags?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  modules: Module[];
  tags: string[];
  outcomes: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  totalLearners: number;
  rating: number;
  totalLessons: number;
  totalDuration: number;
  // New properties for enhanced course structure
  quizzes?: Quiz[];
  codingExercises?: CodingExercise[];
  codingPlaygrounds?: CodingPlayground[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  duration: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // in minutes
  points?: number;
  tags?: string[];
  // New properties for enhanced module structure
  quizzes?: Quiz[];
  codingExercises?: CodingExercise[];
  codingPlaygrounds?: CodingPlayground[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // legacy, use pages if present
  pages?: Page[];
  type: 'text' | 'video' | 'interactive' | 'quiz' | 'assignment' | 'challenge';
  order: number;
  duration: number;
  status: 'draft' | 'published';
  exercises?: Exercise[];
  mcqs?: MCQ[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // in minutes
  points?: number;
  tags?: string[];
  // New properties for enhanced lesson structure
  quizzes?: Quiz[];
  codingExercises?: CodingExercise[];
  codingPlaygrounds?: CodingPlayground[];
}

// New interfaces for enhanced course structure
export interface Quiz {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'essay';
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  maxAttempts?: number;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  order: number;
  status: 'draft' | 'published';
  estimatedTime?: number; // in minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'essay';
  options?: string[];
  correctAnswer?: string | number | string[];
  explanation?: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface CodingExercise {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  initialCode?: string;
  solution?: string;
  testCases: TestCase[];
  programmingLanguage: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  timeLimit?: number; // in minutes
  hints?: string[];
  tags: string[];
  order: number;
  status: 'draft' | 'published';
  estimatedTime?: number; // in minutes
}

export interface CodingPlayground {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  programmingLanguage: string;
  features: ('console' | 'file-system' | 'debugger' | 'collaboration')[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points?: number;
  tags: string[];
  order: number;
  status: 'draft' | 'published';
  estimatedTime?: number; // in minutes
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'multiple-choice' | 'fill-blank' | 'matching';
  content: string;
  solution?: string;
  testCases?: TestCase[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalLearners: number;
  totalViews: number;
  averageRating: number;
  totalLessons: number;
  totalDuration: number;
}

export interface CourseAnalytics {
  courseId: string;
  views: number;
  completions: number;
  averageRating: number;
  totalLearners: number;
  engagementRate: number;
  lastUpdated: Date;
} 