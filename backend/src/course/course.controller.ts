import { Controller, Get, Post, Put, Delete, Param, Body, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from '../dto/create-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() dto: CreateCourseDto, @Req() req) {
    // req.user.id for ownerId (replace with actual user logic)
    return this.courseService.create(dto, req.user?.id || 'demo-user');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
} 