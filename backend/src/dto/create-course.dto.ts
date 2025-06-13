import { IsString, IsArray, ValidateNested, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePageDto {
  @IsString() id: string;
  @IsString() title: string;
  @IsOptional() @IsString() content?: string;
  order: number;
}

export class CreateLessonDto {
  @IsString() id: string;
  @IsString() title: string;
  order: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreatePageDto) pages: CreatePageDto[];
}

export class CreateModuleDto {
  @IsString() id: string;
  @IsString() title: string;
  order: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateLessonDto) lessons: CreateLessonDto[];
}

export class CreateCourseDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(['draft', 'published', 'archived']) status?: 'draft' | 'published' | 'archived';
  @IsOptional() @IsEnum(['beginner', 'intermediate', 'advanced']) level?: 'beginner' | 'intermediate' | 'advanced';
  @IsOptional() @IsNumber() duration?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) outcomes?: string[];
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateModuleDto) modules: CreateModuleDto[];
  @IsOptional() @IsNumber() totalLearners?: number;
  @IsOptional() @IsNumber() rating?: number;
  @IsOptional() @IsNumber() totalLessons?: number;
  @IsOptional() @IsNumber() totalDuration?: number;
  @IsOptional() @IsNumber() totalViews?: number;
  @IsOptional() thumbnail?: string;
} 