'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Save, 
  Eye, 
  EyeOff,
  X,
  CheckCircle,
  Clock,
  Plus,
  GripVertical
} from 'lucide-react';
import { Course, Module, Lesson, Page } from '@/types/course';
import Button from '@/components/ui/Button';
import CourseSidebar, { CourseNode } from '@/components/course-authoring/CourseSidebar';
import QuillEditor from '@/components/course-authoring/QuillEditor';
import courseService from '@/services/courseService';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { AxiosError } from 'axios';
import QuizEditorContainer from '@/components/course-authoring/QuizEditorContainer';

interface CourseEditorState {
  course: Partial<Course>;
  isSidebarCollapsed: boolean;
  isSettingsPanelOpen: boolean;
  isPreviewMode: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
  sidebarWidth: number;
  isResizing: boolean;
  selectedNodeId?: string;
  saveTimeoutId?: NodeJS.Timeout;
  isLoading: boolean;
  deleteDialog: {
    isOpen: boolean;
    nodeId?: string;
    nodeTitle?: string;
  };
  // Auto-save optimization
  lastSavedCourse: string; // JSON string of last saved course state
  userActivityTimeoutId?: NodeJS.Timeout;
  isUserActive: boolean;
  isEditingQuiz: boolean;
  editingQuizNode: CourseNode | null;
}

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const resizeRef = useRef<HTMLDivElement>(null);
  
  const courseId = params.id as string;
  const isNewCourse = courseId === 'create';
  
  const [state, setState] = useState<CourseEditorState>({
    course: {
      title: 'Untitled Course',
      description: '',
      level: 'beginner',
      modules: [],
      tags: [],
      outcomes: []
    },
    isSidebarCollapsed: false,
    isSettingsPanelOpen: true,
    isPreviewMode: false,
    lastSaved: null,
    isSaving: false,
    sidebarWidth: 320,
    isResizing: false,
    selectedNodeId: undefined,
    isLoading: false,
    deleteDialog: {
      isOpen: false
    },
    // Auto-save optimization
    lastSavedCourse: '', // JSON string of last saved course state
    userActivityTimeoutId: undefined,
    isUserActive: true,
    isEditingQuiz: false,
    editingQuizNode: null
  });

  // Load course data if editing existing course
  useEffect(() => {
    const loadCourse = async () => {
      if (isNewCourse) return;
      
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const courseData = await courseService.getCourse(courseId);
        setState(prev => ({ 
          ...prev, 
          course: courseData,
          isLoading: false 
        }));
      } catch (error) {
        console.error('Failed to load course:', error);
        const axiosError = error as AxiosError<{ message: string }>;
        showToast(
          axiosError.response?.data?.message || 'Failed to load course. Please try again.',
          'error'
        );
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    loadCourse();
  }, [courseId, isNewCourse, showToast]);

  // Auto-create course when user starts editing a new course
  const autoCreateCourse = useCallback(async () => {
    if (!isNewCourse || state.course.id || state.isSaving) return;

    try {
      setState(prev => ({ ...prev, isSaving: true }));
      const newCourse = await courseService.createCourse({
        title: state.course.title || 'Untitled Course',
        description: state.course.description || '',
        level: state.course.level || 'beginner',
        modules: state.course.modules || [],
        tags: state.course.tags || [],
        outcomes: state.course.outcomes || []
      });
      
      setState(prev => ({ 
        ...prev, 
        course: newCourse,
        isSaving: false 
      }));

      // Navigate to the new course ID
      router.replace(`/dashboard/creator/courses/${newCourse.id}`);
      
      showToast('Course created automatically', 'success');
    } catch (error) {
      console.error('Failed to auto-create course:', error);
      setState(prev => ({ ...prev, isSaving: false }));
      const axiosError = error as AxiosError<{ message: string }>;
      showToast(
        axiosError.response?.data?.message || 'Failed to create course. Please try again.',
        'error'
      );
    }
  }, [isNewCourse, state.course, state.isSaving, router, showToast]);

  // Trigger auto-create when user makes first change to a new course
  useEffect(() => {
    if (isNewCourse && !state.course.id && !state.isSaving) {
      // Auto-create course after a short delay when user starts typing
      const timeoutId = setTimeout(() => {
        if (state.course.title !== 'Untitled Course' || 
            state.course.description || 
            (state.course.modules && state.course.modules.length > 0)) {
          autoCreateCourse();
        }
      }, 2000); // Increased delay to 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [isNewCourse, state.course, autoCreateCourse, state.isSaving]);

  // Define handleSave with useCallback
  const handleSave = useCallback(async () => {
    if (state.isSaving) return;

    setState(prev => ({ ...prev, isSaving: true }));
    try {
      let savedCourse;
      
      if (state.course.id) {
        // Update existing course
        savedCourse = await courseService.updateCourse(state.course.id, state.course);
      } else {
        // Create new course if no ID exists
        savedCourse = await courseService.createCourse(state.course);
        
        // Navigate to edit page for the newly created course
        if (savedCourse.id) {
          router.replace(`/dashboard/creator/courses/${savedCourse.id}`);
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        course: savedCourse,
        lastSaved: new Date(),
        isSaving: false,
        lastSavedCourse: JSON.stringify(savedCourse) // Track last saved state
      }));

      showToast('Course saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save course:', error);
      setState(prev => ({ ...prev, isSaving: false }));
      const axiosError = error as AxiosError<{ message: string }>;
      showToast(
        axiosError.response?.data?.message || 'Failed to save course. Please try again.',
        'error'
      );
    }
  }, [state.course, state.isSaving, isNewCourse, router, showToast]);

  // User activity tracking
  const updateUserActivity = useCallback(() => {
    setState(prev => ({ ...prev, isUserActive: true }));
    
    // Clear existing timeout
    if (state.userActivityTimeoutId) {
      clearTimeout(state.userActivityTimeoutId);
    }
    
    // Set user as inactive after 2 seconds of no activity
    const timeoutId = setTimeout(() => {
      setState(prev => ({ ...prev, isUserActive: false }));
    }, 2000);
    
    setState(prev => ({ ...prev, userActivityTimeoutId: timeoutId }));
  }, [state.userActivityTimeoutId]);

  // Check if course has meaningful changes
  const hasChanges = useCallback(() => {
    if (!state.lastSavedCourse) return true; // First save
    
    const currentCourseString = JSON.stringify(state.course);
    return currentCourseString !== state.lastSavedCourse;
  }, [state.course, state.lastSavedCourse]);

  // Auto-save functionality with debounce - only for existing courses
  useEffect(() => {
    if (!state.course.id || state.isSaving || !hasChanges() || state.isUserActive) return;

    const timeoutId = setTimeout(() => {
      handleSave();
    }, 8000); // Auto-save after 8 seconds of no changes and user inactivity

    setState(prev => ({ ...prev, saveTimeoutId: timeoutId }));

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state.course, handleSave, state.isSaving, hasChanges, state.isUserActive]);

  // Cleanup user activity timeout on unmount
  useEffect(() => {
    return () => {
      if (state.userActivityTimeoutId) {
        clearTimeout(state.userActivityTimeoutId);
      }
    };
  }, [state.userActivityTimeoutId]);

  // Convert Course to CourseNode structure
  const convertCourseToNode = (course: Partial<Course>): CourseNode => {
    return {
      id: course.id || 'new-course',
      type: 'course',
      title: course.title || 'Untitled Course',
      isExpanded: true,
      order: 0,
      status: course.status || 'draft',
      difficulty: course.level,
      estimatedTime: course.duration,
      children: [
        // Course-level quizzes
        ...(course.quizzes?.map((quiz, index) => ({
          id: quiz.id || `course-quiz-${index}`,
          type: 'quiz' as const,
          title: quiz.title || `Course Quiz ${index + 1}`,
          isExpanded: false,
          order: index,
          status: quiz.status || 'draft',
          difficulty: quiz.difficulty,
          estimatedTime: quiz.estimatedTime,
          points: quiz.points,
          tags: quiz.tags
        })) || []),
        // Course-level coding exercises
        ...(course.codingExercises?.map((exercise, index) => ({
          id: exercise.id || `course-coding-${index}`,
          type: 'coding-exercise' as const,
          title: exercise.title || `Course Coding Exercise ${index + 1}`,
          isExpanded: false,
          order: index,
          status: exercise.status || 'draft',
          difficulty: exercise.difficulty,
          estimatedTime: exercise.estimatedTime,
          points: exercise.points,
          tags: exercise.tags
        })) || []),
        // Course-level coding playgrounds
        ...(course.codingPlaygrounds?.map((playground, index) => ({
          id: playground.id || `course-playground-${index}`,
          type: 'coding-playground' as const,
          title: playground.title || `Course Coding Playground ${index + 1}`,
          isExpanded: false,
          order: index,
          status: playground.status || 'draft',
          difficulty: playground.difficulty,
          estimatedTime: playground.estimatedTime,
          points: playground.points,
          tags: playground.tags
        })) || []),
        // Modules
        ...(course.modules?.map((module, moduleIndex) => ({
          id: module.id || `module-${moduleIndex}`,
          type: 'module' as const,
          title: module.title || `Module ${moduleIndex + 1}`,
          isExpanded: true,
          order: moduleIndex,
          status: 'draft' as const,
          difficulty: module.difficulty,
          estimatedTime: module.estimatedTime,
          points: module.points,
          tags: module.tags,
          children: [
            // Module-level quizzes
            ...(module.quizzes?.map((quiz, index) => ({
              id: quiz.id || `module-${moduleIndex}-quiz-${index}`,
              type: 'quiz' as const,
              title: quiz.title || `Module Quiz ${index + 1}`,
              isExpanded: false,
              order: index,
              status: quiz.status || 'draft',
              difficulty: quiz.difficulty,
              estimatedTime: quiz.estimatedTime,
              points: quiz.points,
              tags: quiz.tags
            })) || []),
            // Module-level coding exercises
            ...(module.codingExercises?.map((exercise, index) => ({
              id: exercise.id || `module-${moduleIndex}-coding-${index}`,
              type: 'coding-exercise' as const,
              title: exercise.title || `Module Coding Exercise ${index + 1}`,
              isExpanded: false,
              order: index,
              status: exercise.status || 'draft',
              difficulty: exercise.difficulty,
              estimatedTime: exercise.estimatedTime,
              points: exercise.points,
              tags: exercise.tags
            })) || []),
            // Module-level coding playgrounds
            ...(module.codingPlaygrounds?.map((playground, index) => ({
              id: playground.id || `module-${moduleIndex}-playground-${index}`,
              type: 'coding-playground' as const,
              title: playground.title || `Module Coding Playground ${index + 1}`,
              isExpanded: false,
              order: index,
              status: playground.status || 'draft',
              difficulty: playground.difficulty,
              estimatedTime: playground.estimatedTime,
              points: playground.points,
              tags: playground.tags
            })) || []),
            // Lessons
            ...(module.lessons?.map((lesson, lessonIndex) => ({
              id: lesson.id || `lesson-${lessonIndex}`,
              type: 'lesson' as const,
              title: lesson.title || `Lesson ${lessonIndex + 1}`,
              isExpanded: false,
              order: lessonIndex,
              status: lesson.status || 'draft',
              difficulty: lesson.difficulty,
              estimatedTime: lesson.estimatedTime,
              points: lesson.points,
              tags: lesson.tags,
              children: [
                // Lesson-level quizzes
                ...(lesson.quizzes?.map((quiz, index) => ({
                  id: quiz.id || `lesson-${lessonIndex}-quiz-${index}`,
                  type: 'quiz' as const,
                  title: quiz.title || `Lesson Quiz ${index + 1}`,
                  isExpanded: false,
                  order: index,
                  status: quiz.status || 'draft',
                  difficulty: quiz.difficulty,
                  estimatedTime: quiz.estimatedTime,
                  points: quiz.points,
                  tags: quiz.tags
                })) || []),
                // Lesson-level coding exercises
                ...(lesson.codingExercises?.map((exercise, index) => ({
                  id: exercise.id || `lesson-${lessonIndex}-coding-${index}`,
                  type: 'coding-exercise' as const,
                  title: exercise.title || `Lesson Coding Exercise ${index + 1}`,
                  isExpanded: false,
                  order: index,
                  status: exercise.status || 'draft',
                  difficulty: exercise.difficulty,
                  estimatedTime: exercise.estimatedTime,
                  points: exercise.points,
                  tags: exercise.tags
                })) || []),
                // Lesson-level coding playgrounds
                ...(lesson.codingPlaygrounds?.map((playground, index) => ({
                  id: playground.id || `lesson-${lessonIndex}-playground-${index}`,
                  type: 'coding-playground' as const,
                  title: playground.title || `Lesson Coding Playground ${index + 1}`,
                  isExpanded: false,
                  order: index,
                  status: playground.status || 'draft',
                  difficulty: playground.difficulty,
                  estimatedTime: playground.estimatedTime,
                  points: playground.points,
                  tags: playground.tags
                })) || []),
                // Pages
                ...(lesson.pages?.map((page, pageIndex) => ({
                  id: page.id || `page-${pageIndex}`,
                  type: 'page' as const,
                  title: page.title || `Page ${pageIndex + 1}`,
                  isExpanded: false,
                  order: pageIndex,
                  status: 'draft' as const,
                  difficulty: page.difficulty,
                  estimatedTime: page.estimatedTime,
                  points: page.points,
                  tags: page.tags
                })) || [
                  // Only add default page if no pages exist
                  {
                    id: `${lesson.id || `lesson-${lessonIndex}`}-default-page`,
                    type: 'page' as const,
                    title: 'Content Page',
                    isExpanded: false,
                    order: 0,
                    status: 'draft' as const
                  }
                ])
              ]
            })) || [])
          ]
        })) || [])
      ]
    };
  };

  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (state.isResizing) {
        // Calculate new width based on mouse position relative to the viewport
        const newWidth = Math.max(280, Math.min(600, e.clientX));
        setState(prev => ({ ...prev, sidebarWidth: newWidth }));
      }
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isResizing: false }));
    };

    if (state.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [state.isResizing]);

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publish course');
  };

  const togglePreview = () => {
    setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  };

  // Utility to find a node by id in the course tree
  function findNodeById(node: CourseNode, id: string): CourseNode | null {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Course hierarchy handlers
  const handleNodeSelect = (node: CourseNode) => {
    setState(prev => ({
      ...prev,
      selectedNodeId: node.id,
      isEditingQuiz: node.type === 'quiz',
      editingQuizNode: node.type === 'quiz' ? node : null
    }));
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<CourseNode>) => {
    updateUserActivity(); // Track user activity
    
    setState(prev => {
      // Deep clone the course to avoid mutation issues
      const newCourse = JSON.parse(JSON.stringify(prev.course));
      
      // Update course node
      if (nodeId === 'new-course' || nodeId === newCourse.id) {
        if (updates.title) newCourse.title = updates.title;
        return { ...prev, course: newCourse };
      }
      
      // Update module
      if (newCourse.modules) {
        for (const module of newCourse.modules) {
          if (module.id === nodeId) {
            if (updates.title) module.title = updates.title;
            return { ...prev, course: newCourse };
          }
          
          // Update lesson
          if (module.lessons) {
            for (const lesson of module.lessons) {
              if (lesson.id === nodeId) {
                if (updates.title) lesson.title = updates.title;
                if (updates.status) lesson.status = updates.status as 'draft' | 'published' | 'archived';
                return { ...prev, course: newCourse };
              }
              
              // Update page
              if (lesson.pages) {
                for (const page of lesson.pages) {
                  if (page.id === nodeId) {
                    if (updates.title) page.title = updates.title;
                    return { ...prev, course: newCourse };
                  }
                }
              }
            }
          }
        }
      }
      
      return prev;
    });
  };

  const handleNodeDelete = (nodeId: string, nodeTitle: string) => {
    setState(prev => ({
      ...prev,
      deleteDialog: {
        isOpen: true,
        nodeId,
        nodeTitle
      }
    }));
  };

  const handleConfirmDelete = () => {
    if (!state.deleteDialog.nodeId) return;

    setState(prev => {
      // Deep clone the course to avoid mutation issues
      const newCourse = JSON.parse(JSON.stringify(prev.course));
      
      // Delete module
      if (newCourse.modules) {
        newCourse.modules = newCourse.modules.filter((module: Module) => {
          if (module.id === state.deleteDialog.nodeId) return false;
          
          // Delete lesson
          if (module.lessons) {
            module.lessons = module.lessons.filter((lesson: Lesson) => {
              if (lesson.id === state.deleteDialog.nodeId) return false;
              
              // Delete page
              if (lesson.pages) {
                lesson.pages = lesson.pages.filter((page: Page) => page.id !== state.deleteDialog.nodeId);
              }
              
              return true;
            });
          }
          
          return true;
        });
      }
      
      // If the deleted node was selected, clear the selection
      const newState = {
        ...prev,
        course: newCourse,
        deleteDialog: {
          isOpen: false
        }
      };
      
      if (prev.selectedNodeId === state.deleteDialog.nodeId) {
        newState.selectedNodeId = undefined;
      }
      
      return newState;
    });

    showToast('Item deleted successfully', 'success');
  };

  const handleCancelDelete = () => {
    setState(prev => ({
      ...prev,
      deleteDialog: {
        isOpen: false
      }
    }));
  };

  const handleNodeDuplicate = (nodeId: string) => {
    setState(prev => {
      // Deep clone the course to avoid mutation issues
      const newCourse = JSON.parse(JSON.stringify(prev.course));
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      
      // Duplicate module
      if (newCourse.modules) {
        for (let i = 0; i < newCourse.modules.length; i++) {
          const module = newCourse.modules[i];
          
          if (module.id === nodeId) {
            // Create a duplicate module with new ID
            const duplicateModule = { 
              ...JSON.parse(JSON.stringify(module)),
              id: `module-${timestamp}-${random}`,
              title: `${module.title} (Copy)`,
              order: newCourse.modules.length
            };
            
            // Recursively assign new IDs to all children
            if (duplicateModule.lessons) {
              duplicateModule.lessons = duplicateModule.lessons.map((lesson: Lesson, idx: number) => {
                const newLesson = {
                  ...lesson,
                  id: `lesson-${timestamp}-${random}-${idx}`,
                  title: lesson.title
                };
                
                if (newLesson.pages) {
                  newLesson.pages = newLesson.pages.map((page: Page, pageIdx: number) => ({
                    ...page,
                    id: `page-${timestamp}-${random}-${idx}-${pageIdx}`,
                    title: page.title
                  }));
                }
                
                return newLesson;
              });
            }
            
            newCourse.modules.push(duplicateModule);
            return { ...prev, course: newCourse };
          }
          
          // Duplicate lesson
          if (module.lessons) {
            for (let j = 0; j < module.lessons.length; j++) {
              const lesson = module.lessons[j];
              
              if (lesson.id === nodeId) {
                // Create a duplicate lesson with new ID
                const duplicateLesson = {
                  ...JSON.parse(JSON.stringify(lesson)),
                  id: `lesson-${timestamp}-${random}`,
                  title: `${lesson.title} (Copy)`,
                  order: module.lessons.length
                };
                
                // Recursively assign new IDs to all children
                if (duplicateLesson.pages) {
                  duplicateLesson.pages = duplicateLesson.pages.map((page: Page, pageIdx: number) => ({
                    ...page,
                    id: `page-${timestamp}-${random}-${pageIdx}`,
                    title: page.title
                  }));
                }
                
                module.lessons.push(duplicateLesson);
                return { ...prev, course: newCourse };
              }
              
              // Duplicate page
              if (lesson.pages) {
                for (let k = 0; k < lesson.pages.length; k++) {
                  const page = lesson.pages[k];
                  
                  if (page.id === nodeId) {
                    // Create a duplicate page with new ID
                    const duplicatePage = {
                      ...JSON.parse(JSON.stringify(page)),
                      id: `page-${timestamp}-${random}`,
                      title: `${page.title} (Copy)`,
                      order: lesson.pages.length
                    };
                    
                    lesson.pages.push(duplicatePage);
                    return { ...prev, course: newCourse };
                  }
                }
              }
            }
          }
        }
      }
      
      return prev;
    });
  };

  const handleNodeAdd = (parentId: string, type: CourseNode['type']) => {
    console.log('Adding node:', { parentId, type });
    
    // Add new node to course structure
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    setState(prev => {
      // Deep clone the course to avoid mutation issues in StrictMode
      const newCourse = JSON.parse(JSON.stringify(prev.course));
      
      if (type === 'module') {
        const newModule = {
          id: `module-${timestamp}-${random}`,
          title: 'New Module',
          description: '',
          order: (newCourse.modules?.length || 0),
          lessons: []
        };
        newCourse.modules = [...(newCourse.modules || []), newModule];
        console.log('Added module:', newModule);
      } else if (type === 'lesson') {
        for (const module of newCourse.modules || []) {
          if (module.id === parentId) {
            const newLesson = {
              id: `lesson-${timestamp}-${random}`,
              title: 'New Lesson',
              description: '',
              content: '',
              type: 'text',
              order: (module.lessons?.length || 0),
              status: 'draft',
              pages: []
            };
            module.lessons = [...(module.lessons || []), newLesson];
            console.log('Added lesson:', newLesson);
            break;
          }
        }
      } else if (type === 'page') {
        console.log('Adding page to lesson:', parentId);
        for (const module of newCourse.modules || []) {
          for (const lesson of module.lessons || []) {
            if (lesson.id === parentId) {
              const newPage = {
                id: `page-${timestamp}-${random}`,
                title: 'New Page',
                content: '',
                order: (lesson.pages?.length || 0)
              };
              lesson.pages = [...(lesson.pages || []), newPage];
              console.log('Added page:', newPage);
              console.log('Lesson pages after adding:', lesson.pages);
              
              // Select the newly created page
              setTimeout(() => {
                setState(current => ({
                  ...current,
                  selectedNodeId: newPage.id
                }));
              }, 100);
              break;
            }
          }
        }
      } else if (type === 'quiz') {
        const parent = findNodeById(courseNode, parentId);
        if (parent && parent.children && parent.children.length > 0) {
          const newQuizNode = parent.children[parent.children.length - 1];
          setState(prev => ({
            ...prev,
            selectedNodeId: newQuizNode.id,
            isEditingQuiz: true,
            editingQuizNode: newQuizNode
          }));
        }
      } else if (type === 'coding-exercise') {
        // Add coding exercise at module or lesson level
        for (const module of newCourse.modules || []) {
          if (module.id === parentId) {
            // Module-level coding exercise
            const newExercise = {
              id: `module-coding-${timestamp}-${random}`,
              title: 'New Module Coding Exercise',
              description: '',
              problemStatement: '',
              testCases: [],
              programmingLanguage: 'javascript',
              difficulty: 'beginner',
              points: 100,
              hints: [],
              tags: [],
              order: (module.codingExercises?.length || 0),
              status: 'draft',
              estimatedTime: 30
            };
            module.codingExercises = [...(module.codingExercises || []), newExercise];
            console.log('Added module coding exercise:', newExercise);
            break;
          }
          
          for (const lesson of module.lessons || []) {
            if (lesson.id === parentId) {
              // Lesson-level coding exercise
              const newExercise = {
                id: `lesson-coding-${timestamp}-${random}`,
                title: 'New Lesson Coding Exercise',
                description: '',
                problemStatement: '',
                testCases: [],
                programmingLanguage: 'javascript',
                difficulty: 'beginner',
                points: 50,
                hints: [],
                tags: [],
                order: (lesson.codingExercises?.length || 0),
                status: 'draft',
                estimatedTime: 15
              };
              lesson.codingExercises = [...(lesson.codingExercises || []), newExercise];
              console.log('Added lesson coding exercise:', newExercise);
              break;
            }
          }
        }
      } else if (type === 'coding-playground') {
        // Add coding playground at course, module, or lesson level
        if (parentId === newCourse.id || parentId === 'new-course') {
          // Course-level coding playground
          const newPlayground = {
            id: `course-playground-${timestamp}-${random}`,
            title: 'New Course Coding Playground',
            description: '',
            initialCode: '// Start coding here...',
            programmingLanguage: 'javascript',
            features: ['console', 'file-system'],
            difficulty: 'beginner',
            points: 0,
            tags: [],
            order: (newCourse.codingPlaygrounds?.length || 0),
            status: 'draft',
            estimatedTime: 60
          };
          newCourse.codingPlaygrounds = [...(newCourse.codingPlaygrounds || []), newPlayground];
          console.log('Added course coding playground:', newPlayground);
        } else {
          // Module or lesson level coding playground
          for (const module of newCourse.modules || []) {
            if (module.id === parentId) {
              // Module-level coding playground
              const newPlayground = {
                id: `module-playground-${timestamp}-${random}`,
                title: 'New Module Coding Playground',
                description: '',
                initialCode: '// Start coding here...',
                programmingLanguage: 'javascript',
                features: ['console', 'file-system'],
                difficulty: 'beginner',
                points: 0,
                tags: [],
                order: (module.codingPlaygrounds?.length || 0),
                status: 'draft',
                estimatedTime: 45
              };
              module.codingPlaygrounds = [...(module.codingPlaygrounds || []), newPlayground];
              console.log('Added module coding playground:', newPlayground);
              break;
            }
            
            for (const lesson of module.lessons || []) {
              if (lesson.id === parentId) {
                // Lesson-level coding playground
                const newPlayground = {
                  id: `lesson-playground-${timestamp}-${random}`,
                  title: 'New Lesson Coding Playground',
                  description: '',
                  initialCode: '// Start coding here...',
                  programmingLanguage: 'javascript',
                  features: ['console'],
                  difficulty: 'beginner',
                  points: 0,
                  tags: [],
                  order: (lesson.codingPlaygrounds?.length || 0),
                  status: 'draft',
                  estimatedTime: 30
                };
                lesson.codingPlaygrounds = [...(lesson.codingPlaygrounds || []), newPlayground];
                console.log('Added lesson coding playground:', newPlayground);
                break;
              }
            }
          }
        }
      }
      
      console.log('New course structure:', newCourse);
      return {
        ...prev,
        course: newCourse
      };
    });
  };

  const handleNodeReorder = (parentId: string, newOrder: string[]) => {
    setState(prev => {
      // Deep clone the course to avoid mutation issues
      const newCourse = JSON.parse(JSON.stringify(prev.course));
      // Helper to reorder children by newOrder
      function reorderChildren(children: any[], newOrder: string[]) {
        return newOrder.map(id => children.find(child => child.id === id)).filter(Boolean);
      }
      // Recursive function to find and reorder children
      function recursiveReorder(node: any) {
        if (node.id === parentId && node.children) {
          node.children = reorderChildren(node.children, newOrder);
          // Update order property if present
          node.children.forEach((child: any, idx: number) => { child.order = idx; });
        } else if (node.children) {
          node.children.forEach(recursiveReorder);
        }
      }
      // Convert course to node structure if needed
      let rootNode = convertCourseToNode(newCourse);
      recursiveReorder(rootNode);
      // Convert back to course structure if needed (optional, if your app expects it)
      return { ...prev, course: newCourse };
    });
  };

  const courseNode = convertCourseToNode(state.course);

  // Add getSelectedNodeContent function
  const getSelectedNodeContent = (): string => {
    if (!state.selectedNodeId || !state.course.modules) return '';
    
    // Search through the course structure to find the selected node
    for (const module of state.course.modules) {
      if (module.id === state.selectedNodeId) {
        return module.description || '';
      }
      
      if (module.lessons) {
        for (const lesson of module.lessons) {
          if (lesson.id === state.selectedNodeId) {
            return lesson.content || '';
          }
          
          if (lesson.pages) {
            for (const page of lesson.pages) {
              if (page.id === state.selectedNodeId) {
                return page.content || '';
              }
            }
          }
        }
      }
    }
    
    return '';
  };
  
  // Add handleContentUpdate function
  const handleContentUpdate = (content: string) => {
    if (!state.selectedNodeId) return;
    
    updateUserActivity(); // Track user activity
    
    setState(prev => {
      // Deep clone the course to avoid mutation issues
      const newCourse = JSON.parse(JSON.stringify(prev.course));
      let contentUpdated = false;
      
      // Update the content of the selected node
      for (const module of newCourse.modules || []) {
        if (module.id === state.selectedNodeId) {
          module.description = content;
          contentUpdated = true;
          break;
        }
        
        for (const lesson of module.lessons || []) {
          if (lesson.id === state.selectedNodeId) {
            lesson.content = content;
            contentUpdated = true;
            break;
          }
          
          for (const page of lesson.pages || []) {
            if (page.id === state.selectedNodeId) {
              page.content = content;
              contentUpdated = true;
              break;
            }
          }
          if (contentUpdated) break;
        }
        if (contentUpdated) break;
      }
      
      // If content was updated, return new state
      if (contentUpdated) {
        // Clear any existing auto-save timeout
        if (prev.saveTimeoutId) {
          clearTimeout(prev.saveTimeoutId);
        }
        
        return {
          ...prev,
          course: newCourse,
          lastSaved: null // Reset lastSaved to trigger auto-save
        };
      }
      
      return prev;
    });
  };

  if (state.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sticky Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10"
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={state.course.title ?? ""}
                onChange={(e) => {
                  updateUserActivity();
                  setState(prev => ({
                    ...prev,
                    course: { ...prev.course, title: e.target.value }
                  }))
                }}
                className="text-xl font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 min-w-[200px] max-w-[400px]"
                placeholder="Course Title"
              />
              
              {/* Save Status */}
              <div className="flex items-center gap-2 text-sm">
                {state.isSaving ? (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Clock className="w-4 h-4" />
                    <span>Saving...</span>
                  </div>
                ) : state.lastSaved ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved {state.lastSaved instanceof Date ? state.lastSaved.toLocaleTimeString() : new Date(state.lastSaved as string).toLocaleTimeString()}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-500">
                    <span>Unsaved</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              icon={state.isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onClick={togglePreview}
            >
              {state.isPreviewMode ? 'Exit Preview' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              loading={state.isSaving}
            >
              Save
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
            >
              Publish
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!state.isSidebarCollapsed && (
          <div
            className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col relative flex-shrink-0"
            style={{ width: state.sidebarWidth }}
          >
            <CourseSidebar
              course={courseNode}
              onNodeSelect={handleNodeSelect}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onNodeDuplicate={handleNodeDuplicate}
              onNodeAdd={handleNodeAdd}
              onNodeReorder={handleNodeReorder}
              selectedNodeId={state.selectedNodeId}
            />
            {/* Inline Resize Handle */}
            <div
              ref={resizeRef}
              className="absolute right-0 top-0 bottom-0 w-1 hover:w-2 bg-transparent hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-all duration-200 group"
              onMouseDown={() => setState(prev => ({ ...prev, isResizing: true }))}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3 h-3 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Toggle Button (when collapsed) */}
        {state.isSidebarCollapsed && (
          <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-12 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setState(prev => ({ ...prev, isSidebarCollapsed: false }))}
              className="p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Center Editor Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-w-0">
          <div className="flex-1 overflow-auto p-6">
            {state.isEditingQuiz && state.editingQuizNode ? (
              <QuizEditorContainer quizNode={state.editingQuizNode} />
            ) : state.selectedNodeId ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <QuillEditor
                    key={state.selectedNodeId}
                    content={getSelectedNodeContent()}
                    onChange={handleContentUpdate}
                    placeholder="Start writing your content..."
                    className="min-h-[500px]"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium mb-2">Select an item to edit</p>
                  <p className="text-sm">Choose a module, lesson, or page from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Settings Panel */}
        <AnimatePresence>
          {state.isSettingsPanelOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col"
            >
              <div className="h-full flex flex-col">
                {/* Settings Header */}
                <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                    Settings
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setState(prev => ({ ...prev, isSettingsPanelOpen: false }))}
                    className="p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Settings Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* TODO: Course Settings Component */}
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <p>Course Settings</p>
                    <p className="text-sm">Coming soon...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Toggle Button (when closed) */}
        {!state.isSettingsPanelOpen && (
          <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-12 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setState(prev => ({ ...prev, isSettingsPanelOpen: true }))}
              className="p-1"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={state.deleteDialog.isOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${state.deleteDialog.nodeTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
} 