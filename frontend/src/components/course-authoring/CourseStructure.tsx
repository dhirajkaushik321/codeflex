'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText, 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreHorizontal,
  GripVertical,
  Clock,
  Eye,
  Lock,
  Unlock,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  BookOpen,
  Video,
  CheckCircle,
  Circle,
  Play,
  Pause
} from 'lucide-react';
import Button from '@/components/ui/Button';

export interface CourseNode {
  id: string;
  type: 'course' | 'module' | 'lesson' | 'page' | 'quiz';
  title: string;
  description?: string;
  isExpanded?: boolean;
  children?: CourseNode[];
  order: number;
  status?: 'draft' | 'published' | 'archived';
  duration?: number;
  progress?: number;
  isLocked?: boolean;
  contentType?: 'text' | 'video' | 'quiz' | 'assignment';
}

interface CourseStructureProps {
  course: CourseNode;
  onNodeSelect?: (node: CourseNode) => void;
  onNodeUpdate?: (nodeId: string, updates: Partial<CourseNode>) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeDuplicate?: (nodeId: string) => void;
  onNodeAdd?: (parentId: string, type: CourseNode['type']) => void;
  onNodeReorder?: (nodeId: string, newOrder: number) => void;
  selectedNodeId?: string;
}

interface StructureItemProps {
  node: CourseNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onSelect: (node: CourseNode) => void;
  onUpdate: (nodeId: string, updates: Partial<CourseNode>) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onAdd: (parentId: string, type: CourseNode['type']) => void;
  selectedNodeId?: string;
  isDragging?: boolean;
}

const StructureItem = ({ 
  node, 
  level, 
  onToggle, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onAdd, 
  selectedNodeId,
  isDragging = false
}: StructureItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.title);
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lastClickRef = useRef<{ timestamp: number } | null>(null);

  const getNodeIcon = (type: CourseNode['type'], contentType?: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'module':
        return <Folder className="w-4 h-4 text-purple-600" />;
      case 'lesson':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'page':
        if (contentType === 'video') return <Video className="w-4 h-4 text-red-600" />;
        if (contentType === 'quiz') return <Target className="w-4 h-4 text-orange-600" />;
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'quiz':
        return <Target className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status?: string, progress?: number) => {
    if (status === 'published') {
      return progress === 100 ? (
        <CheckCircle className="w-3 h-3 text-green-500" />
      ) : (
        <Circle className="w-3 h-3 text-green-500" />
      );
    }
    if (status === 'archived') {
      return <Lock className="w-3 h-3 text-gray-400" />;
    }
    return <Circle className="w-3 h-3 text-gray-300" />;
  };

  const handleAddClick = (e: React.MouseEvent, type: CourseNode['type']) => {
    console.log('handleAddClick called:', { parentId: node.id, type });
    e.preventDefault();
    e.stopPropagation();
    
    const now = Date.now();
    if (lastClickRef.current && (now - lastClickRef.current.timestamp) < 200) {
      console.log('Rapid click detected, ignoring');
      return;
    }
    lastClickRef.current = { timestamp: now };
    
    console.log('Calling onAdd with:', node.id, type);
    onAdd(node.id, type);
  };

  const canAddChildren = node.type === 'course' || node.type === 'module' || node.type === 'lesson';
  const addChildType = node.type === 'course' ? 'module' : node.type === 'module' ? 'lesson' : node.type === 'lesson' ? 'page' : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`group relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
          ${selectedNodeId === node.id 
            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
          }
          ${isHovered ? 'shadow-sm' : ''}
        `}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => onSelect(node)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag Handle */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-gray-400 cursor-grab active:cursor-grabbing" />
        </div>

        {/* Expand/Collapse Icon */}
        {node.children && node.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="flex-shrink-0 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {node.isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </button>
        )}

        {/* Node Icon */}
        <div className="flex-shrink-0">
          {getNodeIcon(node.type, node.contentType)}
        </div>

        {/* Status Icon */}
        <div className="flex-shrink-0">
          {getStatusIcon(node.status, node.progress)}
        </div>

        {/* Node Title */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false);
                  onUpdate(node.id, { title: editValue.trim() });
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditValue(node.title);
                }
              }}
              onBlur={() => {
                setIsEditing(false);
                onUpdate(node.id, { title: editValue.trim() });
              }}
              className="w-full bg-transparent border-none outline-none text-sm font-medium"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{node.title}</span>
              {node.duration && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {node.duration}m
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canAddChildren && (
            <button
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title={`Add ${addChildType}`}
              onClick={(e) => handleAddClick(e, addChildType!)}
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
          
          <button
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Rename"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit2 className="w-3 h-3" />
          </button>
          
          {node.type !== 'course' && (
            <button
              className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {node.isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 border-l border-gray-200 dark:border-gray-700"
          >
            {node.children.map((child) => (
              <StructureItem
                key={child.id}
                node={child}
                level={level + 1}
                onToggle={onToggle}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onAdd={onAdd}
                selectedNodeId={selectedNodeId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function CourseStructure({
  course,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeDuplicate,
  onNodeAdd,
  onNodeReorder,
  selectedNodeId
}: CourseStructureProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([course.id]));
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const lastOperationRef = useRef<{ parentId: string; type: string; timestamp: number } | null>(null);

  const handleToggle = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const isNodeExpanded = (nodeId: string) => {
    return expandedNodes.has(nodeId);
  };

  // Create a new course object with expanded state
  const courseWithExpandedState = {
    ...course,
    isExpanded: isNodeExpanded(course.id),
    children: course.children?.map(child => ({
      ...child,
      isExpanded: isNodeExpanded(child.id),
      children: child.children?.map(grandChild => ({
        ...grandChild,
        isExpanded: isNodeExpanded(grandChild.id)
      }))
    }))
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<CourseNode>) => {
    onNodeUpdate?.(nodeId, updates);
  };

  const handleNodeDelete = (nodeId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onNodeDelete?.(nodeId);
    }
  };

  const handleNodeDuplicate = (nodeId: string) => {
    onNodeDuplicate?.(nodeId);
  };

  const handleNodeAdd = (parentId: string, type: CourseNode['type']) => {
    console.log('CourseStructure handleNodeAdd called:', { parentId, type, isProcessing });
    
    // Prevent duplicate operations
    if (isProcessing) {
      console.log('Already processing, skipping...');
      return;
    }
    
    const now = Date.now();
    const operationKey = `${parentId}-${type}`;
    
    // Check for rapid duplicate operations (within 300ms)
    if (lastOperationRef.current) {
      const { parentId: lastParentId, type: lastType, timestamp } = lastOperationRef.current;
      const lastOperationKey = `${lastParentId}-${lastType}`;
      
      if (operationKey === lastOperationKey && (now - timestamp) < 300) {
        console.log('Rapid duplicate operation detected, skipping:', operationKey);
        return;
      }
    }
    
    // Set processing flag immediately
    setIsProcessing(true);
    lastOperationRef.current = { parentId, type, timestamp: now };
    
    console.log('CourseStructure: Processing add operation:', { parentId, type, timestamp: now });
    onNodeAdd?.(parentId, type);
    
    // Reset processing flag after a delay
    setTimeout(() => {
      console.log('CourseStructure: Resetting isProcessing flag');
      setIsProcessing(false);
    }, 800);
  };

  const totalModules = course.children?.length || 0;
  const totalLessons = course.children?.reduce((acc, module) => acc + (module.children?.length || 0), 0) || 0;
  const totalPages = course.children?.reduce((acc, module) => 
    acc + (module.children?.reduce((lessonAcc, lesson) => lessonAcc + (lesson.children?.length || 0), 0) || 0), 0
  ) || 0;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Course Structure
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalModules} modules • {totalLessons} lessons • {totalPages} pages
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {course.children && course.children.length > 0 ? (
          <StructureItem
            node={courseWithExpandedState}
            level={0}
            onToggle={handleToggle}
            onSelect={onNodeSelect || (() => {})}
            onUpdate={handleNodeUpdate}
            onDelete={handleNodeDelete}
            onDuplicate={handleNodeDuplicate}
            onAdd={handleNodeAdd}
            selectedNodeId={selectedNodeId}
          />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start Building Your Course
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Create your first module to organize your course content
            </p>
            <Button 
              onClick={() => onNodeAdd?.(course.id, 'module')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Module
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          onClick={() => onNodeAdd?.(course.id, 'module')}
          variant="outline"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>
    </div>
  );
} 