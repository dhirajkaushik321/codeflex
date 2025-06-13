'use client';
import { useState, useEffect } from 'react';
import { Course, CourseStats, CourseAnalytics } from '@/types/course';
import courseService from '@/services/courseService';

// Mock stats for development (will be replaced with real API later)
const mockStats: CourseStats = {
  totalCourses: 0,
  publishedCourses: 0,
  draftCourses: 0,
  totalLearners: 0,
  totalViews: 0,
  averageRating: 0,
  totalLessons: 0,
  totalDuration: 0
};

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load courses and stats from backend
  const loadCourses = async () => {
    try {
      setLoading(true);
      
      // Load courses and stats in parallel
      const [fetchedCourses, fetchedStats] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getCreatorStats()
      ]);
      
      setCourses(fetchedCourses);
      setStats(fetchedStats);
      setError(null);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses');
      // Fallback to empty state
      setCourses([]);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  // Create new course
  const createCourse = async (courseData: Partial<Course>) => {
    try {
      setLoading(true);
      const newCourse = await courseService.createCourse(courseData);
      setCourses(prev => [newCourse, ...prev]);
      
      // Refresh stats after creating course
      const updatedStats = await courseService.getCreatorStats();
      setStats(updatedStats);
      
      return newCourse;
    } catch (err) {
      console.error('Failed to create course:', err);
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
      const updatedCourse = await courseService.updateCourse(id, updates);
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      
      // Refresh stats after updating course
      const updatedStats = await courseService.getCreatorStats();
      setStats(updatedStats);
      
      return updatedCourse;
    } catch (err) {
      console.error('Failed to update course:', err);
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
      await courseService.deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
      
      // Refresh stats after deleting course
      const updatedStats = await courseService.getCreatorStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Failed to delete course:', err);
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
      const publishedCourse = await courseService.updateCourse(id, { 
        status: 'published',
        publishedAt: new Date()
      });
      setCourses(prev => prev.map(course => 
        course.id === id ? publishedCourse : course
      ));
      
      // Refresh stats after publishing course
      const updatedStats = await courseService.getCreatorStats();
      setStats(updatedStats);
      
      return publishedCourse;
    } catch (err) {
      console.error('Failed to publish course:', err);
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

  // Load courses on mount
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
    refreshCourses: loadCourses
  };
} 