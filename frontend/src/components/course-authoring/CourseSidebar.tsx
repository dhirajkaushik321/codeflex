'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Folder,
  FileText,
  ChevronRight,
  Edit3,
  Trash2,
  Copy,
  MoreHorizontal,
  Sparkles,
  Zap,
  Target,
  BookOpen,
  Layers,
  GripVertical,
  HelpCircle,
  Code,
  Play,
  Brain,
  Puzzle,
  Terminal,
  TestTube,
  Rocket,
  Lightbulb,
  Trophy,
  Clock,
  Star
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ReactDOM from 'react-dom';

export interface CourseNode {
  id: string;
  type: 'course' | 'module' | 'lesson' | 'page' | 'quiz' | 'coding-exercise' | 'coding-playground';
  title: string;
  isExpanded?: boolean;
  children?: CourseNode[];
  order: number;
  status?: 'draft' | 'published' | 'archived';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // in minutes
  points?: number;
  tags?: string[];
}

interface CourseSidebarProps {
  course: CourseNode;
  onNodeSelect: (node: CourseNode) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<CourseNode>) => void;
  onNodeDelete: (nodeId: string, nodeTitle: string) => void;
  onNodeDuplicate: (nodeId: string) => void;
  onNodeAdd: (parentId: string, type: CourseNode['type']) => void;
  onNodeReorder: (parentId: string, newOrder: string[]) => void;
  selectedNodeId?: string;
}

interface TreeNodeProps {
  node: CourseNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onSelect: (node: CourseNode) => void;
  onUpdate: (nodeId: string, updates: Partial<CourseNode>) => void;
  onDelete: (nodeId: string, nodeTitle: string) => void;
  onDuplicate: (nodeId: string) => void;
  onAdd: (parentId: string, type: CourseNode['type']) => void;
  selectedNodeId?: string;
}

const TreeNode = ({ 
  node, 
  level, 
  onToggle, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onAdd, 
  selectedNodeId
}: TreeNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.title);
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActions(false);
        setShowAddMenu(false);
      }
    };

    if (showActions || showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions, showAddMenu]);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowActions(false);
        setShowAddMenu(false);
      }
    };

    if (showActions || showAddMenu) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showActions, showAddMenu]);

  const getNodeIcon = (type: CourseNode['type']) => {
    switch (type) {
      case 'course':
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>;
      case 'module':
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
          <Layers className="w-3.5 h-3.5 text-white" />
        </div>;
      case 'lesson':
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>;
      case 'page':
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center shadow-sm">
          <FileText className="w-3.5 h-3.5 text-white" />
        </div>;
      case 'quiz':
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-white" />
        </div>;
      case 'coding-exercise':
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
          <Code className="w-3.5 h-3.5 text-white" />
        </div>;
      case 'coding-playground':
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-sm">
          <Terminal className="w-3.5 h-3.5 text-white" />
        </div>;
      default:
        return <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center shadow-sm">
          <Target className="w-3.5 h-3.5 text-white" />
        </div>;
    }
  };

  const getNodeTypeLabel = (type: CourseNode['type']) => {
    switch (type) {
      case 'course': return 'Course';
      case 'module': return 'Module';
      case 'lesson': return 'Lesson';
      case 'page': return 'Page';
      case 'quiz': return 'Quiz';
      case 'coding-exercise': return 'Coding Exercise';
      case 'coding-playground': return 'Coding Playground';
      default: return 'Item';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const canAddChildren = node.type === 'course' || node.type === 'module' || node.type === 'lesson';
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = node.isExpanded !== false;
  const isSelected = selectedNodeId === node.id;

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(node.title);
    setShowActions(false);
  };

  const handleSave = () => {
    if (editValue.trim() && editValue !== node.title) {
      onUpdate(node.id, { title: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(node.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSelect = () => {
    if (node.type === 'page' || node.type === 'quiz' || node.type === 'coding-exercise' || node.type === 'coding-playground') {
      onSelect(node);
    } else {
      onToggle(node.id);
    }
  };

  const getAddOptions = () => {
    const options = [];
    
    if (node.type === 'course') {
      options.push(
        { type: 'module', label: 'Module', icon: <Layers className="w-4 h-4" />, description: 'Organize lessons' },
        { type: 'quiz', label: 'Course Quiz', icon: <HelpCircle className="w-4 h-4" />, description: 'Test course knowledge' },
        { type: 'coding-playground', label: 'Coding Playground', icon: <Terminal className="w-4 h-4" />, description: 'Interactive coding environment' }
      );
    } else if (node.type === 'module') {
      options.push(
        { type: 'lesson', label: 'Lesson', icon: <BookOpen className="w-4 h-4" />, description: 'Educational content' },
        { type: 'quiz', label: 'Module Quiz', icon: <HelpCircle className="w-4 h-4" />, description: 'Test module knowledge' },
        { type: 'coding-exercise', label: 'Coding Exercise', icon: <Code className="w-4 h-4" />, description: 'Programming challenges' },
        { type: 'coding-playground', label: 'Coding Playground', icon: <Terminal className="w-4 h-4" />, description: 'Interactive coding environment' }
      );
    } else if (node.type === 'lesson') {
      options.push(
        { type: 'page', label: 'Page', icon: <FileText className="w-4 h-4" />, description: 'Content page' },
        { type: 'quiz', label: 'Lesson Quiz', icon: <HelpCircle className="w-4 h-4" />, description: 'Test lesson knowledge' },
        { type: 'coding-exercise', label: 'Coding Exercise', icon: <Code className="w-4 h-4" />, description: 'Programming challenges' },
        { type: 'coding-playground', label: 'Coding Playground', icon: <Terminal className="w-4 h-4" />, description: 'Interactive coding environment' }
      );
    }
    
    return options;
  };

  const handleAddMenuOpen = () => {
    if (addButtonRef.current) {
      const rect = addButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.right - 256, // 256px = dropdown width
      });
    }
    setShowAddMenu(true);
  };

  return (
    <div className="relative">
      <motion.div
        className={`
          group relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ease-out
          ${isSelected 
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-l-blue-500 shadow-sm' 
            : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent'
          }
        `}
        style={{ 
          paddingLeft: `${level * 20 + 16}px`,
        }}
        onClick={handleSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hierarchy connector */}
        {level > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-700" />
        )}

        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </motion.div>
        )}
        {!hasChildren && <div className="w-5 h-5 flex-shrink-0" />}

        {/* Node Icon */}
        <div className="flex-shrink-0">
          {getNodeIcon(node.type)}
        </div>

        {/* Node Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 rounded px-1"
              autoFocus
            />
          ) : (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span 
                  className={`text-sm font-medium truncate block max-w-full ${
                    isSelected 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  title={node.title}
                >
                  {node.title}
                </span>
                {node.points && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-xs text-yellow-700 dark:text-yellow-400">
                    <Trophy className="w-3 h-3" />
                    <span>{node.points}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {getNodeTypeLabel(node.type)}
                </span>
                
                {node.difficulty && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${getDifficultyColor(node.difficulty)}`}>
                    {node.difficulty}
                  </span>
                )}
                
                {node.estimatedTime && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{node.estimatedTime}m</span>
                  </div>
                )}
                
                {node.status && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    node.status === 'published' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : node.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {node.status}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {(isHovered || isSelected) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="flex items-center gap-1 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Add Button */}
              {canAddChildren && (
                <button
                  ref={addButtonRef}
                  className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-600 dark:text-blue-400"
                  onClick={handleAddMenuOpen}
                  title="Add content"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}

              {/* More Actions Button */}
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                onClick={() => setShowActions(!showActions)}
                title="More actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Content Menu */}
        {showAddMenu && dropdownPosition && ReactDOM.createPortal(
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Content
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {getAddOptions().map((option) => (
                  <button
                    key={option.type}
                    className="w-full flex items-center gap-3 p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                    onClick={() => {
                      onAdd(node.id, option.type as CourseNode['type']);
                      setShowAddMenu(false);
                    }}
                  >
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      {option.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>,
          document.body
        )}

        {/* Contextual Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    handleEdit();
                    setShowActions(false);
                  }}
                >
                  <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span>Edit</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  onClick={() => {
                    onDuplicate(node.id);
                    setShowActions(false);
                  }}
                >
                  <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Duplicate</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  onClick={() => {
                    onDelete(node.id, node.title);
                    setShowActions(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div>
              {node.children!.map((child, index) => (
                <TreeNode
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CourseSidebar({
  course,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeDuplicate,
  onNodeAdd,
  onNodeReorder,
  selectedNodeId
}: CourseSidebarProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([course.id]));
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; nodeId?: string; nodeTitle?: string }>({
    isOpen: false
  });

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

  const handleDelete = (nodeId: string, nodeTitle: string) => {
    setDeleteDialog({ isOpen: true, nodeId, nodeTitle });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.nodeId && deleteDialog.nodeTitle) {
      onNodeDelete(deleteDialog.nodeId, deleteDialog.nodeTitle);
    }
    setDeleteDialog({ isOpen: false });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false });
  };

  // Create a new course object with expanded state
  const courseWithExpandedState = useMemo(() => ({
    ...course,
    isExpanded: isNodeExpanded(course.id),
    children: course.children?.map(child => ({
      ...child,
      isExpanded: isNodeExpanded(child.id),
      children: child.children?.map(grandChild => ({
        ...grandChild,
        isExpanded: isNodeExpanded(grandChild.id),
        children: grandChild.children || []
      })) || []
    })) || []
  }), [course, expandedNodes]);

  return (
    <>
      <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-r border-gray-200 dark:border-gray-700 shadow-sm w-80 max-w-sm min-w-64">
        {/* Header */}
        <motion.div 
          className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Course Builder
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Create amazing learning experiences
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <TreeNode
            node={courseWithExpandedState}
            level={0}
            onToggle={handleToggle}
            onSelect={onNodeSelect}
            onUpdate={onNodeUpdate}
            onDelete={handleDelete}
            onDuplicate={onNodeDuplicate}
            onAdd={onNodeAdd}
            selectedNodeId={selectedNodeId}
          />
        </div>

        {/* Footer */}
        <motion.div 
          className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Lightbulb className="w-3 h-3" />
            <span>World's Best Learning Platform</span>
          </div>
        </motion.div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteDialog.nodeTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
} 