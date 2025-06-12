export interface Page {
  id: string;
  title: string;
  content: string;
  order: number;
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
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  duration: number;
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