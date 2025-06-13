import axiosInstance from '@/lib/axios';
import { Course } from '@/types/course';

function normalizeCourseData(courseData: Partial<Course>): Partial<Course> {
  // Deep clone to avoid mutation
  const data = JSON.parse(JSON.stringify(courseData));
  
  // Remove id and _id fields to prevent duplicate key errors when creating new courses
  // MongoDB will generate a new _id automatically
  delete data.id;
  delete data._id;
  
  // Ensure all required fields are present
  if (data.modules) {
    data.modules.forEach((module: any) => {
      // Ensure module has required fields
      if (!module.id) module.id = `module-${Date.now()}-${Math.random()}`;
      if (!module.title) module.title = 'New Module';
      if (typeof module.order !== 'number') module.order = 0;
      
      if (module.lessons) {
        module.lessons.forEach((lesson: any) => {
          // Ensure lesson has required fields
          if (!lesson.id) lesson.id = `lesson-${Date.now()}-${Math.random()}`;
          if (!lesson.title) lesson.title = 'New Lesson';
          if (typeof lesson.order !== 'number') lesson.order = 0;
          
          if (lesson.pages) {
            lesson.pages.forEach((page: any) => {
              // Ensure page has required fields
              if (!page.id) page.id = `page-${Date.now()}-${Math.random()}`;
              if (!page.title) page.title = 'New Page';
              if (typeof page.order !== 'number') page.order = 0;
              if (typeof page.content !== 'string') {
                page.content = '';
              }
            });
          }
        });
      }
    });
  }
  
  return data;
}

function normalizeCourseResponse(courseData: any): Course {
  // Normalize backend response to frontend format
  return {
    ...courseData,
    id: courseData._id || courseData.id,
    tags: Array.isArray(courseData.tags) ? courseData.tags : [],
    outcomes: Array.isArray(courseData.outcomes) ? courseData.outcomes : [],
    modules: Array.isArray(courseData.modules) ? courseData.modules : [],
    totalLearners: courseData.totalLearners || 0,
    rating: courseData.rating || 0,
    totalLessons: courseData.totalLessons || 0,
    totalDuration: courseData.totalDuration || 0,
    totalViews: courseData.totalViews || 0,
    createdAt: new Date(courseData.createdAt || Date.now()),
    updatedAt: new Date(courseData.updatedAt || Date.now()),
    publishedAt: courseData.publishedAt ? new Date(courseData.publishedAt) : undefined
  };
}

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await axiosInstance.get('/courses');
      return response.data.map(normalizeCourseResponse);
    } catch (error) {
      console.error('Failed to get all courses:', error);
      throw error;
    }
  },

  async getCreatorStats(): Promise<any> {
    try {
      const response = await axiosInstance.get('/courses/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get creator stats:', error);
      throw error;
    }
  },

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      const normalized = normalizeCourseData(courseData);
      const response = await axiosInstance.post('/courses', normalized);
      return normalizeCourseResponse(response.data);
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  },

  async getCourse(id: string): Promise<Course> {
    try {
      const response = await axiosInstance.get(`/courses/${id}`);
      return normalizeCourseResponse(response.data);
    } catch (error) {
      console.error('Failed to get course:', error);
      throw error;
    }
  },

  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const normalized = normalizeCourseData(courseData);
      const response = await axiosInstance.put(`/courses/${id}`, normalized);
      return normalizeCourseResponse(response.data);
    } catch (error) {
      console.error('Failed to update course:', error);
      throw error;
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/courses/${id}`);
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw error;
    }
  }
};

export default courseService; 