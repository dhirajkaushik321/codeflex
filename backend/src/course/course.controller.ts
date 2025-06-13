import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() dto: CreateCourseDto, @Req() req) {
    // Get user ID from authenticated request
    const ownerId = req.user.userId;
    return this.courseService.create(dto, ownerId);
  }

  @Get()
  async findAll(@Req() req) {
    // Get user ID from authenticated request to filter courses by owner
    const ownerId = req.user.userId;
    return this.courseService.findAll(ownerId);
  }

  @Get('stats')
  async getCreatorStats(@Req() req) {
    // Get user ID from authenticated request to get creator-specific stats
    const ownerId = req.user.userId;
    return this.courseService.getCreatorStats(ownerId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    // Get user ID from authenticated request to ensure course belongs to owner
    const ownerId = req.user.userId;
    return this.courseService.findOne(id, ownerId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateCourseDto, @Req() req) {
    // Get user ID from authenticated request to ensure course belongs to owner
    const ownerId = req.user.userId;
    return this.courseService.update(id, dto, ownerId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    // Get user ID from authenticated request to ensure course belongs to owner
    const ownerId = req.user.userId;
    return this.courseService.remove(id, ownerId);
  }
} 