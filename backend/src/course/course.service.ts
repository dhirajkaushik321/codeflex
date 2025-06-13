import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async create(dto: CreateCourseDto, ownerId: string) {
    // Remove any existing _id to prevent duplicate key errors
    const { _id, ...courseData } = dto as any;
    
    // Create new course with owner association
    const newCourse = new this.courseModel({
      ...courseData,
      ownerId,
      status: dto.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return await newCourse.save();
  }

  async findAll(ownerId?: string) {
    // If ownerId is provided, filter courses by owner
    const query = ownerId ? { ownerId } : {};
    return this.courseModel.find(query).sort({ updatedAt: -1 }).lean();
  }

  async findOne(id: string, ownerId?: string) {
    // If ownerId is provided, ensure the course belongs to the owner
    const query = ownerId ? { _id: id, ownerId } : { _id: id };
    return this.courseModel.findOne(query);
  }

  async update(id: string, dto: CreateCourseDto, ownerId?: string) {
    // Remove _id from update data to prevent duplicate key errors
    const { _id, ...updateData } = dto as any;
    
    // Build query with optional owner check
    const query = ownerId ? { _id: id, ownerId } : { _id: id };
    
    return this.courseModel.findOneAndUpdate(
      query,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
  }

  async remove(id: string, ownerId?: string) {
    // Build query with optional owner check
    const query = ownerId ? { _id: id, ownerId } : { _id: id };
    return this.courseModel.findOneAndDelete(query);
  }

  async getCreatorStats(ownerId: string) {
    const courses = await this.courseModel.find({ ownerId }).lean();
    
    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'published').length,
      draftCourses: courses.filter(c => c.status === 'draft').length,
      totalLearners: courses.reduce((sum, c) => sum + (c.totalLearners || 0), 0),
      totalViews: courses.reduce((sum, c) => sum + (c.totalViews || 0), 0),
      averageRating: courses.length > 0 
        ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length 
        : 0,
      totalLessons: courses.reduce((sum, c) => sum + (c.totalLessons || 0), 0),
      totalDuration: courses.reduce((sum, c) => sum + (c.totalDuration || 0), 0)
    };
  }
} 