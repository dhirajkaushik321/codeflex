'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import Button from '@/components/ui/Button';
import CourseHierarchy, { CourseNode } from '@/components/course-authoring/CourseHierarchy';

interface CourseCreateState {
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

export default function CreateCoursePage() {
  const router = useRouter();
  const { createCourse, loading } = useCourses();
  const resizeRef = useRef<HTMLDivElement>(null);
  
  const [state, setState] = useState<CourseCreateState>({
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
    selectedNodeId: undefined
  });

  // Convert Course to CourseNode structure
  const convertCourseToNode = (course: Partial<Course>): CourseNode => {
    return {
      id: course.id || 'new-course',
      type: 'course',
      title: course.title || 'Untitled Course',
      isExpanded: true,
      order: 0,
      status: course.status || 'draft',
      children: course.modules?.map((module, moduleIndex) => ({
        id: module.id,
        type: 'module' as const,
        title: module.title,
        isExpanded: true,
        order: moduleIndex,
        status: 'draft' as const,
        children: module.lessons?.map((lesson, lessonIndex) => ({
          id: lesson.id,
          type: 'lesson' as const,
          title: lesson.title,
          isExpanded: false,
          order: lessonIndex,
          status: lesson.status,
          children: [
            // Add a default page for each lesson
            {
              id: `${lesson.id}-page`,
              type: 'page' as const,
              title: 'Content Page',
              isExpanded: false,
              order: 0,
              status: 'draft' as const
            }
          ]
        }))
      })) || []
    };
  };

  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (state.isResizing) {
        const newWidth = Math.max(200, Math.min(600, e.clientX));
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

  const handleSave = async () => {
    setState(prev => ({ ...prev, isSaving: true }));
    try {
      const newCourse = await createCourse(state.course);
      setState(prev => ({ 
        ...prev, 
        lastSaved: new Date(),
        isSaving: false 
      }));
      
      // Navigate to edit page for the newly created course
      router.push(`/dashboard/creator/courses/${newCourse.id}/edit`);
    } catch (error) {
      console.error('Failed to create course:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publish course');
  };

  const togglePreview = () => {
    setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  };

  // Course hierarchy handlers
  const handleNodeSelect = (node: CourseNode) => {
    setState(prev => ({ ...prev, selectedNodeId: node.id }));
    // TODO: Load the selected node's content in the editor
    console.log('Selected node:', node);
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<CourseNode>) => {
    // TODO: Update the course structure
    console.log('Update node:', nodeId, updates);
  };

  const handleNodeDelete = (nodeId: string) => {
    // TODO: Delete the node from course structure
    console.log('Delete node:', nodeId);
  };

  const handleNodeDuplicate = (nodeId: string) => {
    // TODO: Duplicate the node
    console.log('Duplicate node:', nodeId);
  };

  const handleNodeAdd = (parentId: string, type: CourseNode['type']) => {
    // TODO: Add new node to course structure
    console.log('Add node:', parentId, type);
  };

  const handleNodeReorder = (nodeId: string, newOrder: number) => {
    // TODO: Reorder nodes
    console.log('Reorder node:', nodeId, newOrder);
  };

  const courseNode = convertCourseToNode(state.course);

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
                value={state.course.title}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  course: { ...prev.course, title: e.target.value }
                }))}
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
                    <span>Saved {state.lastSaved.toLocaleTimeString()}</span>
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
        <AnimatePresence>
          {!state.isSidebarCollapsed && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: state.sidebarWidth }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col relative"
            >
              <CourseHierarchy
                course={courseNode}
                onNodeSelect={handleNodeSelect}
                onNodeUpdate={handleNodeUpdate}
                onNodeDelete={handleNodeDelete}
                onNodeDuplicate={handleNodeDuplicate}
                onNodeAdd={handleNodeAdd}
                onNodeReorder={handleNodeReorder}
                selectedNodeId={state.selectedNodeId}
              />

              {/* Resize Handle */}
              <div
                ref={resizeRef}
                className="absolute right-0 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors"
                onMouseDown={() => setState(prev => ({ ...prev, isResizing: true }))}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <GripVertical className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          <div className="flex-1 overflow-hidden">
            {/* TODO: Rich Text Editor Component */}
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium mb-2">Rich Text Editor</p>
                <p className="text-sm">Coming soon...</p>
                {state.selectedNodeId && (
                  <p className="text-xs mt-2">Selected: {state.selectedNodeId}</p>
                )}
              </div>
            </div>
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
    </div>
  );
} 