'use client';
import { useState, useEffect } from 'react';
import { Course, CourseStats, CourseAnalytics } from '@/types/course';

// Mock data for development
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Developer Course',
    description: 'Master React from basics to advanced concepts with hands-on projects',
    level: 'intermediate',
    duration: 480,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to React',
        description: 'Learn the fundamentals of React and JSX',
        order: 0,
        lessons: [
          {
            id: 'l1',
            title: 'What is React?',
            description: 'Understanding React and its benefits',
            content: '<h1>What is React?</h1><p>React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta.</p><h2>Key Features:</h2><ul><li>Component-based architecture</li><li>Virtual DOM</li><li>JSX syntax</li><li>Unidirectional data flow</li></ul>',
            type: 'text',
            order: 0,
            duration: 15,
            status: 'published'
          },
          {
            id: 'l2',
            title: 'Setting Up Your Development Environment',
            description: 'Install Node.js, npm, and create your first React app',
            content: '<h1>Setting Up Your Development Environment</h1><p>Before you start building React applications, you need to set up your development environment.</p><h2>Prerequisites:</h2><ol><li>Install Node.js (version 14 or higher)</li><li>Install npm (comes with Node.js)</li><li>Install a code editor (VS Code recommended)</li></ol><h2>Creating Your First React App:</h2><pre><code>npx create-react-app my-app\ncd my-app\nnpm start</code></pre>',
            type: 'text',
            order: 1,
            duration: 20,
            status: 'published'
          }
        ],
        duration: 35
      },
      {
        id: 'm2',
        title: 'React Components',
        description: 'Learn about functional and class components',
        order: 1,
        lessons: [
          {
            id: 'l3',
            title: 'Functional Components',
            description: 'Creating and using functional components',
            content: '<h1>Functional Components</h1><p>Functional components are the modern way to write React components. They are simpler and more performant than class components.</p><h2>Basic Syntax:</h2><pre><code>function Welcome(props) {\n  return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;;\n}</code></pre><h2>Arrow Function Syntax:</h2><pre><code>const Welcome = (props) =&gt; {\n  return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;;\n};</code></pre>',
            type: 'text',
            order: 0,
            duration: 25,
            status: 'draft'
          }
        ],
        duration: 25
      }
    ],
    tags: ['React', 'JavaScript', 'Frontend'],
    outcomes: ['Build real-world React applications', 'Understand React hooks and context', 'Master state management'],
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-20'),
    totalLearners: 1250,
    rating: 4.8,
    totalLessons: 24,
    totalDuration: 480
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    description: 'Learn JavaScript from scratch with practical examples',
    level: 'beginner',
    duration: 360,
    modules: [
      {
        id: 'm3',
        title: 'JavaScript Basics',
        description: 'Learn the fundamentals of JavaScript programming',
        order: 0,
        lessons: [
          {
            id: 'l4',
            title: 'Variables and Data Types',
            description: 'Understanding variables, strings, numbers, and booleans',
            content: '<h1>Variables and Data Types</h1><p>JavaScript is a dynamically typed language, which means you don\'t need to declare the type of a variable.</p><h2>Variable Declaration:</h2><pre><code>let name = "John";\nconst age = 25;\nvar oldWay = "not recommended";</code></pre><h2>Data Types:</h2><ul><li><strong>String:</strong> Text data</li><li><strong>Number:</strong> Numeric data</li><li><strong>Boolean:</strong> true or false</li><li><strong>Undefined:</strong> Variable declared but not assigned</li><li><strong>Null:</strong> Intentional absence of value</li></ul>',
            type: 'text',
            order: 0,
            duration: 30,
            status: 'published'
          }
        ],
        duration: 30
      }
    ],
    tags: ['JavaScript', 'Programming', 'Basics'],
    outcomes: ['Understand JavaScript syntax', 'Master DOM manipulation', 'Learn async programming'],
    status: 'draft',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    totalLearners: 0,
    rating: 0,
    totalLessons: 18,
    totalDuration: 360
  },
  {
    id: '3',
    title: 'Advanced TypeScript Patterns',
    description: 'Deep dive into TypeScript advanced features and design patterns',
    level: 'advanced',
    duration: 300,
    modules: [],
    tags: ['TypeScript', 'Advanced', 'Design Patterns'],
    outcomes: ['Master advanced TypeScript features', 'Implement design patterns', 'Build scalable applications'],
    status: 'published',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    publishedAt: new Date('2024-01-12'),
    totalLearners: 890,
    rating: 4.9,
    totalLessons: 16,
    totalDuration: 300
  }
];

const mockStats: CourseStats = {
  totalCourses: 3,
  publishedCourses: 2,
  draftCourses: 1,
  totalLearners: 2140,
  totalViews: 15600,
  averageRating: 4.85,
  totalLessons: 58,
  totalDuration: 1140
};

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load courses
  const loadCourses = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourses(mockCourses);
      setStats(mockStats);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Create new course
  const createCourse = async (courseData: Partial<Course>) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseData.title || 'Untitled Course',
        description: courseData.description || '',
        level: courseData.level || 'beginner',
        duration: courseData.duration || 0,
        modules: courseData.modules || [],
        tags: courseData.tags || [],
        outcomes: courseData.outcomes || [],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        totalLearners: 0,
        rating: 0,
        totalLessons: 0,
        totalDuration: 0
      };

      setCourses(prev => [newCourse, ...prev]);
      return newCourse;
    } catch (err) {
      setError('Failed to create course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update course
  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCourses(prev => prev.map(course => 
        course.id === id 
          ? { ...course, ...updates, updatedAt: new Date() }
          : course
      ));
    } catch (err) {
      setError('Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async (id: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      setError('Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Publish course
  const publishCourse = async (id: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCourses(prev => prev.map(course => 
        course.id === id 
          ? { 
              ...course, 
              status: 'published', 
              publishedAt: new Date(),
              updatedAt: new Date() 
            }
          : course
      ));
    } catch (err) {
      setError('Failed to publish course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get course by ID
  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  // Get courses by status
  const getCoursesByStatus = (status: Course['status']) => {
    return courses.filter(course => course.status === status);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    stats,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    publishCourse,
    getCourseById,
    getCoursesByStatus,
    loadCourses
  };
} 