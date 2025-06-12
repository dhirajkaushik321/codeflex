'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Eye, 
  Settings, 
  Plus,
  Folder,
  FileText,
  Target,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Clock,
  Users,
  Star,
  BookOpen,
  Video,
  CheckCircle,
  Circle,
  Play,
  Pause
} from 'lucide-react';
import Button from '@/components/ui/Button';
import CourseStructure, { CourseNode } from '@/components/course-authoring/CourseStructure';
import QuillEditor from '@/components/course-authoring/QuillEditor';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  duration: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  duration: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'text' | 'video' | 'quiz';
  order: number;
  duration: number;
  status: 'draft' | 'published' | 'archived';
  pages: Page[];
}

interface Page {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface CourseEditState {
  course: Partial<Course>;
  isSidebarCollapsed: boolean;
  isSettingsPanelOpen: boolean;
  isPreviewMode: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
  sidebarWidth: number;
  isResizing: boolean;
  selectedNodeId?: string;
}

// Global operation tracker to prevent duplicates
const globalOperationTracker = {
  currentOperation: null as { parentId: string; type: string; timestamp: number } | null,
  isProcessing: false,
  
  canProcess(parentId: string, type: string): boolean {
    const now = Date.now();
    const operationKey = `${parentId}-${type}`;
    
    if (this.isProcessing) {
      console.log('Global: Already processing, skipping...');
      return false;
    }
    
    if (this.currentOperation) {
      const { parentId: lastParentId, type: lastType, timestamp } = this.currentOperation;
      const lastOperationKey = `${lastParentId}-${lastType}`;
      
      if (operationKey === lastOperationKey && (now - timestamp) < 500) {
        console.log('Global: Rapid duplicate operation detected, skipping:', operationKey);
        return false;
      }
    }
    
    return true;
  },
  
  startOperation(parentId: string, type: string): void {
    const now = Date.now();
    this.currentOperation = { parentId, type, timestamp: now };
    this.isProcessing = true;
    console.log('Global: Started operation:', { parentId, type, timestamp: now });
  },
  
  endOperation(): void {
    this.isProcessing = false;
    console.log('Global: Ended operation');
  }
};

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  const [state, setState] = useState<CourseEditState>({
    course: {
      id: courseId,
      title: '',
      description: '',
      modules: [],
      duration: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    isSidebarCollapsed: false,
    isSettingsPanelOpen: false,
    isPreviewMode: false,
    lastSaved: null,
    isSaving: false,
    sidebarWidth: 320,
    isResizing: false,
    selectedNodeId: undefined
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const lastAddOperationRef = useRef<{ parentId: string; type: string; timestamp: number } | null>(null);

  // Convert Course to CourseNode for the sidebar
  const convertCourseToNode = (course: Course): CourseNode => {
    return {
      id: course.id,
      type: 'course',
      title: course.title,
      description: course.description,
      order: 0,
      status: course.status,
      duration: course.duration,
      children: course.modules?.map(module => ({
        id: module.id,
        type: 'module',
        title: module.title,
        description: module.description,
        order: module.order,
        duration: module.duration,
        children: module.lessons?.map(lesson => ({
          id: lesson.id,
          type: 'lesson',
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          duration: lesson.duration,
          status: lesson.status,
          contentType: lesson.type,
          children: lesson.pages?.map(page => ({
            id: page.id,
            type: 'page',
            title: page.title,
            order: page.order,
            contentType: 'text'
          }))
        }))
      }))
    };
  };

  // Load course data
  useEffect(() => {
    const loadCourse = () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      setTimeout(() => {
        const mockCourse: Course = {
          id: courseId,
          title: 'JavaScript Fundamentals',
          description: 'Learn the basics of JavaScript programming',
          modules: [
            {
              id: 'm1',
              title: 'Introduction to JavaScript',
              description: 'Get started with JavaScript basics',
              order: 0,
              lessons: [
                {
                  id: 'l1',
                  title: 'What is JavaScript?',
                  description: 'Understanding JavaScript and its role in web development',
                  content: '',
                  type: 'text',
                  order: 0,
                  duration: 15,
                  status: 'draft',
                  pages: [
                    {
                      id: 'p1',
                      title: 'Introduction',
                      content: '<p>Welcome to JavaScript Fundamentals!</p>',
                      order: 0
                    }
                  ]
                }
              ],
              duration: 15
            }
          ],
          duration: 15,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setState(prev => ({
          ...prev,
          course: mockCourse,
          selectedNodeId: 'p1'
        }));
        setIsLoading(false);
      }, 1000);
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (state.isResizing) {
        const newWidth = Math.max(280, Math.min(500, e.clientX));
        setState(prev => ({ ...prev, sidebarWidth: newWidth }));
      }
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isResizing: false }));
    };

    if (state.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isResizing]);

  const handleSave = async () => {
    setState(prev => ({ ...prev, isSaving: true }));
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState(prev => ({ 
      ...prev, 
      isSaving: false, 
      lastSaved: new Date() 
    }));
  };

  const handlePublish = () => {
    // Handle publish logic
    console.log('Publishing course...');
  };

  const togglePreview = () => {
    setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  };

  const handleNodeSelect = (node: CourseNode) => {
    setState(prev => ({ ...prev, selectedNodeId: node.id }));
  };

  const handlePageContentUpdate = (content: string) => {
    setState(prev => {
      const newCourse = { ...prev.course };
      
      // Find and update the selected page content
      for (const module of newCourse.modules || []) {
        for (const lesson of module.lessons || []) {
          for (const page of lesson.pages || []) {
            if (page.id === prev.selectedNodeId) {
              page.content = content;
              break;
            }
          }
        }
      }
      
      return {
        ...prev,
        course: newCourse
      };
    });
  };

  const getSelectedPageContent = () => {
    if (!state.selectedNodeId) return '';
    
    for (const module of state.course.modules || []) {
      for (const lesson of module.lessons || []) {
        for (const page of lesson.pages || []) {
          if (page.id === state.selectedNodeId) {
            return page.content;
          }
        }
      }
    }
    
    return '';
  };

  const getSelectedNodeInfo = () => {
    if (!state.selectedNodeId) return null;
    
    for (const module of state.course.modules || []) {
      for (const lesson of module.lessons || []) {
        for (const page of lesson.pages || []) {
          if (page.id === state.selectedNodeId) {
            return { type: 'page', title: page.title };
          }
        }
        if (lesson.id === state.selectedNodeId) {
          return { type: 'lesson', title: lesson.title };
        }
      }
      if (module.id === state.selectedNodeId) {
        return { type: 'module', title: module.title };
      }
    }
    
    return null;
  };

  // Handle node operations
  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<CourseNode>) => {
    setState(prev => {
      const newCourse = { ...prev.course };
      
      // Update course title
      if (nodeId === newCourse.id && updates.title) {
        newCourse.title = updates.title;
      }
      
      // Update module
      for (const module of newCourse.modules || []) {
        if (module.id === nodeId) {
          if (updates.title) module.title = updates.title;
          if (updates.description) module.description = updates.description;
          break;
        }
        
        // Update lesson
        for (const lesson of module.lessons || []) {
          if (lesson.id === nodeId) {
            if (updates.title) lesson.title = updates.title;
            if (updates.description) lesson.description = updates.description;
            break;
          }
          
          // Update page
          for (const page of lesson.pages || []) {
            if (page.id === nodeId) {
              if (updates.title) page.title = updates.title;
              break;
            }
          }
        }
      }
      
      return {
        ...prev,
        course: newCourse
      };
    });
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setState(prev => {
      const newCourse = { ...prev.course };
      
      // Delete module
      newCourse.modules = newCourse.modules?.filter(module => {
        if (module.id === nodeId) return false;
        
        // Delete lesson
        module.lessons = module.lessons?.filter(lesson => {
          if (lesson.id === nodeId) return false;
          
          // Delete page
          lesson.pages = lesson.pages?.filter(page => page.id !== nodeId);
          return true;
        });
        
        return true;
      });
      
      return {
        ...prev,
        course: newCourse,
        selectedNodeId: prev.selectedNodeId === nodeId ? undefined : prev.selectedNodeId
      };
    });
  }, []);

  const handleNodeDuplicate = useCallback((nodeId: string) => {
    // Handle duplicate logic
    console.log('Duplicating node:', nodeId);
  }, []);

  const handleNodeAdd = useCallback((parentId: string, type: CourseNode['type']) => {
    console.log('handleNodeAdd called:', { parentId, type });
    
    if (!globalOperationTracker.canProcess(parentId, type)) {
      return;
    }
    globalOperationTracker.startOperation(parentId, type);
    console.log('Processing add operation:', { parentId, type });
    setState(prev => {
      // Deep clone the course to avoid mutation issues in StrictMode
      const newCourse: Course = JSON.parse(JSON.stringify(prev.course));
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      if (type === 'module') {
        const newModule: Module = {
          id: `module-${timestamp}-${random}`,
          title: 'New Module',
          description: '',
          order: (newCourse.modules?.length || 0),
          lessons: [],
          duration: 0
        };
        newCourse.modules = [...(newCourse.modules || []), newModule];
        console.log('Added module:', newModule.id);
      } else if (type === 'lesson') {
        for (const module of newCourse.modules || []) {
          if (module.id === parentId) {
            const newLesson: Lesson = {
              id: `lesson-${timestamp}-${random}`,
              title: 'New Lesson',
              description: '',
              content: '',
              type: 'text',
              order: (module.lessons?.length || 0),
              duration: 0,
              status: 'draft',
              pages: []
            };
            module.lessons = [...(module.lessons || []), newLesson];
            console.log('Added lesson:', newLesson.id, 'to module:', parentId);
            break;
          }
        }
      } else if (type === 'page') {
        for (const module of newCourse.modules || []) {
          for (const lesson of module.lessons || []) {
            if (lesson.id === parentId) {
              const newPage: Page = {
                id: `page-${timestamp}-${random}`,
                title: 'New Page',
                content: '',
                order: (lesson.pages?.length || 0)
              };
              lesson.pages = [...(lesson.pages || []), newPage];
              console.log('Added page:', newPage.id, 'to lesson:', parentId);
              break;
            }
          }
        }
      }
      return {
        ...prev,
        course: newCourse
      };
    });
    setTimeout(() => {
      globalOperationTracker.endOperation();
    }, 1000);
  }, []);

  const handleNodeReorder = useCallback((nodeId: string, newOrder: number) => {
    // Handle reorder logic
    console.log('Reordering node:', nodeId, 'to position:', newOrder);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Course</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const selectedNodeInfo = getSelectedNodeInfo();
  const courseNode = convertCourseToNode(state.course as Course);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div 
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out"
        style={{ width: state.isSidebarCollapsed ? 60 : state.sidebarWidth }}
      >
        {state.isSidebarCollapsed ? (
          <div className="p-2">
            <button 
              onClick={() => setState(prev => ({ ...prev, isSidebarCollapsed: false }))}
              className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-500 mx-auto" />
            </button>
          </div>
        ) : (
          <CourseStructure
            course={courseNode}
            onNodeSelect={handleNodeSelect}
            onNodeUpdate={handleNodeUpdate}
            onNodeDelete={handleNodeDelete}
            onNodeDuplicate={handleNodeDuplicate}
            onNodeAdd={handleNodeAdd}
            onNodeReorder={handleNodeReorder}
            selectedNodeId={state.selectedNodeId}
          />
        )}
      </div>

      {/* Resize Handle */}
      {!state.isSidebarCollapsed && (
        <div
          className="w-1 bg-gray-200 dark:bg-gray-700 cursor-col-resize hover:bg-blue-500 transition-colors"
          onMouseDown={() => setState(prev => ({ ...prev, isResizing: true }))}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setState(prev => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {state.course.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`
                    px-2 py-1 text-xs rounded-full font-medium
                    ${state.course.status === 'published' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : state.course.status === 'archived' 
                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }
                  `}>
                    {state.course.status}
                  </span>
                  {state.lastSaved && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last saved {state.lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={togglePreview}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setState(prev => ({ ...prev, isSettingsPanelOpen: !prev.isSettingsPanelOpen }))}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={state.isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {state.isSaving ? 'Saving...' : 'Save'}
              </Button>
              
              <Button
                variant="primary"
                onClick={handlePublish}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {selectedNodeInfo ? (
            <div className="h-full flex flex-col">
              {/* Content Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedNodeInfo.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {selectedNodeInfo.type}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Rename
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <QuillEditor
                      key={state.selectedNodeId}
                      content={getSelectedPageContent()}
                      onChange={handlePageContentUpdate}
                      placeholder="Start writing your page content..."
                      className="min-h-[500px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select Content to Edit
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  Choose a module, lesson, or page from the sidebar to start editing your course content
                </p>
                <Button onClick={() => setState(prev => ({ ...prev, isSidebarCollapsed: false }))}>
                  Open Course Structure
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 