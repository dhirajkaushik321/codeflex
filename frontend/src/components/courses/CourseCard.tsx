'use client';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Edit, Eye, Trash2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/course';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onView?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  onPublish?: (courseId: string) => void;
  delay?: number;
}

export default function CourseCard({ 
  course, 
  onEdit, 
  onView, 
  onDelete, 
  onPublish,
  delay = 0 
}: CourseCardProps) {
  const router = useRouter();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusVariant = (status: Course['status']) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleEdit = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    if (onEdit) {
      onEdit(course);
    } else {
      // Default behavior: navigate to edit page
      router.push(`/dashboard/creator/courses/${course.id}/edit`);
    }
  };

  const handleView = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    if (onView) {
      onView(course);
    } else {
      // Default behavior: navigate to view page (or show preview)
      console.log('View course:', course.id);
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      delay={delay}
      onClick={handleView}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {course.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant={getStatusVariant(course.status)} size="sm">
              {course.status}
            </Badge>
            <Badge variant="default" size="sm" className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>
        </div>

        {/* Tags */}
        {course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.totalLearners} learners</span>
            </div>
            {course.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="text-xs">
            {course.status === 'published' 
              ? `Published ${formatDate(course.publishedAt!)}`
              : `Updated ${formatDate(course.updatedAt)}`
            }
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              onClick={handleView}
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {course.status === 'draft' && (
              <Button
                variant="primary"
                size="sm"
                icon={<Play className="w-4 h-4" />}
                onClick={(e) => {
                  e?.stopPropagation();
                  onPublish?.(course.id);
                }}
              >
                Publish
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={(e) => {
                e?.stopPropagation();
                onDelete?.(course.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 