import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async create(dto: CreateCourseDto, ownerId: string) {
    return this.courseModel.create({ ...dto, ownerId });
  }

  async findOne(id: string) {
    return this.courseModel.findById(id);
  }

  async update(id: string, dto: CreateCourseDto) {
    return this.courseModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.courseModel.findByIdAndDelete(id);
  }
} 