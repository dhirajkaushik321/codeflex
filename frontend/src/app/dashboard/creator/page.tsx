'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  TrendingUp,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';
import Link from 'next/link';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CourseCard from '@/components/courses/CourseCard';

export default function CreatorDashboard() {
  const { 
    courses, 
    stats, 
    loading, 
    error, 
    updateCourse, 
    deleteCourse, 
    publishCourse 
  } = useCourses();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search courses
  const filteredCourses = courses.filter(course => {
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await publishCourse(courseId);
    } catch (error) {
      console.error('Failed to publish course:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Creator Dashboard ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your courses and create amazing learning experiences
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="purple" size="md">
                ✍️ Content Creator
              </Badge>
              <Link href="/dashboard/creator/courses/create">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Plus className="w-5 h-5" />}
                >
                  Create New Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Analytics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Courses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalCourses}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
                <span>{stats.publishedCourses} published</span>
                <span>•</span>
                <span>{stats.draftCourses} drafts</span>
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Learners
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatNumber(stats.totalLearners)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+12% this month</span>
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Rating
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.averageRating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
                <span>{stats.totalLessons} lessons</span>
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Content
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatDuration(stats.totalDuration)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
                <span>{stats.totalViews} views</span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Course Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Courses
            </h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Courses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Course List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </Card>
          ) : filteredCourses.length === 0 ? (
            <Card className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first course to get started'
                }
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Link href="/dashboard/creator/courses/create">
                  <Button
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Create Your First Course
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  delay={index * 0.1}
                  onDelete={handleDeleteCourse}
                  onPublish={handlePublishCourse}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/creator/coding-question">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💻</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Coding Question
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create programming challenges
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
              <Link href="/creator/tutorial">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📚</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Tutorial
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Write educational content
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
              <Link href="/creator/mcq">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📝</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        MCQ Set
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create multiple choice questions
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
              <Link href="/creator/analytics">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Analytics
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        View content performance
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="purple" size="sm">
                      Course
                    </Badge>
                    <Badge 
                      variant={course.status === 'published' ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {course.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {course.totalLearners} learners
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {course.status === 'published' 
                        ? `Published ${new Date(course.publishedAt!).toLocaleDateString()}`
                        : `Updated ${new Date(course.updatedAt).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 