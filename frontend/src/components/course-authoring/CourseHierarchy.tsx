'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText, 
  Target, 
  Plus, 
  Edit2, 
  Copy, 
  Trash2, 
  MoreHorizontal,
  GripVertical
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '@/components/ui/Button';

export interface CourseNode {
  id: string;
  type: 'course' | 'module' | 'lesson' | 'page' | 'quiz';
  title: string;
  isExpanded?: boolean;
  children?: CourseNode[];
  order: number;
  status?: 'draft' | 'published' | 'archived';
}

interface CourseHierarchyProps {
  course: CourseNode;
  onNodeSelect?: (node: CourseNode) => void;
  onNodeUpdate?: (nodeId: string, updates: Partial<CourseNode>) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeDuplicate?: (nodeId: string) => void;
  onNodeAdd?: (parentId: string, type: CourseNode['type']) => void;
  onNodeReorder?: (nodeId: string, newOrder: number) => void;
  selectedNodeId?: string;
}

interface TreeNodeProps {
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

const TreeNode = ({ 
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
}: TreeNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.title);
  const lastClickRef = useRef<{ parentId: string; type: string; timestamp: number } | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isNodeDragging
  } = useSortable({
    id: node.id,
    disabled: node.type === 'course'
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getNodeIcon = (type: CourseNode['type']) => {
    switch (type) {
      case 'course':
        return <Folder className="w-4 h-4 text-blue-600" />;
      case 'module':
        return <Folder className="w-4 h-4 text-purple-600" />;
      case 'lesson':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'page':
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'quiz':
        return <Target className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNodeTypeLabel = (type: CourseNode['type']) => {
    switch (type) {
      case 'course': return 'Course';
      case 'module': return 'Module';
      case 'lesson': return 'Lesson';
      case 'page': return 'Page';
      case 'quiz': return 'Quiz';
      default: return 'Item';
    }
  };

  const canAddChildren = node.type === 'course' || node.type === 'module' || node.type === 'lesson';
  const addChildType = node.type === 'course' ? 'module' : node.type === 'module' ? 'lesson' : node.type === 'lesson' ? 'page' : undefined;
  const addChildLabel = node.type === 'course' ? 'Module' : node.type === 'module' ? 'Lesson' : node.type === 'lesson' ? 'Page' : '';

  const handleAddClick = (e: React.MouseEvent, parentId: string, type: CourseNode['type']) => {
    console.log('handleAddClick called:', { parentId, type });
    // e.preventDefault();
    // e.stopPropagation();
    
    // const now = Date.now();
    // const operationKey = `${parentId}-${type}`;
    
    // // Check for rapid clicks (within 100ms)
    // if (lastClickRef.current) {
    //   const { parentId: lastParentId, type: lastType, timestamp } = lastClickRef.current;
    //   const lastOperationKey = `${lastParentId}-${lastType}`;
      
    //   if (operationKey === lastOperationKey && (now - timestamp) < 100) {
    //     console.log('TreeNode: Rapid click detected, ignoring:', operationKey);
    //     return;
    //   }
    // }
    
    // // Record this click
    // lastClickRef.current = { parentId, type, timestamp: now };
    
    // const clickTime = new Date().toISOString();
    // console.log(`${type === 'lesson' ? 'Add Lesson' : 'Add Page'} button clicked:`, {
    //   [type === 'lesson' ? 'moduleId' : 'lessonId']: parentId,
    //   [type === 'lesson' ? 'moduleTitle' : 'lessonTitle']: node.title,
    //   clickTime,
    //   eventType: e.type,
    //   eventTarget: e.target,
    //   eventCurrentTarget: e.currentTarget
    // });
    
    // console.log(`Calling onAdd for ${type === 'lesson' ? 'module' : 'lesson'}:`, parentId, type);
    // onAdd(parentId, type);
    // console.log(`onAdd call completed for ${type === 'lesson' ? 'module' : 'lesson'}:`, parentId, type);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`relative ${isNodeDragging ? 'opacity-50' : ''}`}
    >
      <div
        className={`
          group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all
          ${selectedNodeId === node.id 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          ${isDragging ? 'shadow-lg' : ''}
          relative
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        {/* Drag Handle */}
        {node.type !== 'course' && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <GripVertical className="w-3 h-3 text-gray-400" />
          </div>
        )}

        {/* Expand/Collapse Icon */}
        {node.children && node.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {node.isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </button>
        )}

        {/* Node Icon */}
        {getNodeIcon(node.type)}

        {/* Node Title */}
        <div className="flex-1 min-w-0 mr-2">
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
              className="w-full bg-transparent border-none outline-none text-sm"
              autoFocus
            />
          ) : (
            <span className="text-sm truncate block">{node.title}</span>
          )}
        </div>

        {/* Status Badge */}
        {node.status && (
          <span className={`
            px-1.5 py-0.5 text-xs rounded-full flex-shrink-0
            ${node.status === 'published' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : node.status === 'archived' 
                ? 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            }
          `}>
            {node.status}
          </span>
        )}

        {/* Inline always-visible action buttons for each node */}
        <div className="flex gap-1 flex-shrink-0">
          {node.type === 'module' && (
            <button
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              title="Add Lesson"
              onClick={(e) => handleAddClick(e, node.id, 'lesson')}
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
          {node.type === 'lesson' && (
            <button
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              title="Add Page"
              onClick={(e) => handleAddClick(e, node.id, 'page')}
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
          <button
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            title="Rename"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit2 className="w-3 h-3" />
          </button>
          {node.type !== 'course' && (
            <button
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              title="Delete"
              onClick={(e) => {
                e.preventDefault();
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
      {node.isExpanded && node.children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {node.children.map((child) => (
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
        </motion.div>
      )}
    </motion.div>
  );
};

export default function CourseHierarchy({
  course,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeDuplicate,
  onNodeAdd,
  onNodeReorder,
  selectedNodeId
}: CourseHierarchyProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<CourseNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([course.id]));
  const [isAddingNode, setIsAddingNode] = useState(false);
  const lastOperationRef = useRef<{ parentId: string; type: string; timestamp: number } | null>(null);
  const lastAddModuleClickRef = useRef<{ timestamp: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the dragged node
    const findNode = (nodes: CourseNode[], id: string): CourseNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const found = findNode([course], active.id as string);
    setDraggedNode(found);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && over) {
      // Handle reordering logic here
      console.log('Reorder:', active.id, 'to', over.id);
      onNodeReorder?.(active.id as string, 0); // For now, just pass 0 as new order
    }
    
    setActiveId(null);
    setDraggedNode(null);
  };

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

  // Helper function to check if a node is expanded
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
    const callTime = new Date().toISOString();
    console.log('CourseHierarchy handleNodeAdd called:', {
      parentId,
      type,
      callTime,
      isAddingNode,
      lastOperationRef: lastOperationRef.current
    });
    
    if (isAddingNode) {
      console.log('CourseHierarchy: Already adding a node, skipping...');
      return;
    }
    
    // Set flag immediately to prevent any other calls
    setIsAddingNode(true);
    
    // Record this operation to prevent duplicates
    lastOperationRef.current = { parentId, type, timestamp: Date.now() };
    
    console.log('CourseHierarchy: Calling onNodeAdd with:', parentId, type);
    onNodeAdd?.(parentId, type);
    console.log('CourseHierarchy: onNodeAdd call completed for:', parentId, type);
    
    // Reset the flag after a delay
    setTimeout(() => {
      console.log('CourseHierarchy: Resetting isAddingNode flag');
      setIsAddingNode(false);
    }, 1000); // Increased delay to ensure no overlap
  };

  const handleAddModuleClick = () => {
    const now = Date.now();
    
    // Check for rapid clicks (within 100ms)
    if (lastAddModuleClickRef.current) {
      const { timestamp } = lastAddModuleClickRef.current;
      if ((now - timestamp) < 100) {
        console.log('CourseHierarchy: Rapid Add Module click detected, ignoring');
        return;
      }
    }
    
    // Record this click
    lastAddModuleClickRef.current = { timestamp: now };
    
    console.log('CourseHierarchy: Add Module button clicked');
    onNodeAdd?.(course.id, 'module');
  };

  const getNodeTypeLabel = (type: CourseNode['type']) => {
    switch (type) {
      case 'module': return 'Module';
      case 'lesson': return 'Lesson';
      case 'page': return 'Page';
      case 'quiz': return 'Quiz';
      default: return 'Item';
    }
  };

  const getNodeIcon = (type: CourseNode['type']) => {
    switch (type) {
      case 'course':
        return <Folder className="w-4 h-4 text-blue-600" />;
      case 'module':
        return <Folder className="w-4 h-4 text-purple-600" />;
      case 'lesson':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'page':
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'quiz':
        return <Target className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  // Helper function to get all sortable item IDs
  const getAllSortableIds = (node: CourseNode): string[] => {
    const ids: string[] = [];
    if (node.type !== 'course') {
      ids.push(node.id);
    }
    if (node.children) {
      node.children.forEach(child => {
        ids.push(...getAllSortableIds(child));
      });
    }
    return ids;
  };

  const sortableIds = getAllSortableIds(course);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Course Structure
        </h3>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            <TreeNode
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
          </SortableContext>

          <DragOverlay>
            {activeId && draggedNode ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2">
                <div className="flex items-center gap-2">
                  {getNodeIcon(draggedNode.type)}
                  <span className="text-sm font-medium">{draggedNode.title}</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Always-visible Add Module button at the bottom */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button
          className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          onClick={handleAddModuleClick}
        >
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </div>
    </div>
  );
} 