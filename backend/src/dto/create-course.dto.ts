import { IsString, IsArray, ValidateNested, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuizQuestionDto {
  @IsString() id: string;
  @IsString() question: string;
  @IsEnum(['multiple-choice', 'true-false', 'fill-blank', 'matching', 'essay']) type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'essay';
  @IsOptional() @IsArray() @IsString({ each: true }) options?: string[];
  @IsOptional() correctAnswer?: string | number | string[];
  @IsOptional() @IsString() explanation?: string;
  @IsOptional() @IsNumber() points?: number;
  @IsOptional() @IsEnum(['beginner', 'intermediate', 'advanced']) difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export class CreateQuizDto {
  @IsString() id: string;
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(['multiple-choice', 'true-false', 'fill-blank', 'matching', 'essay']) type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'essay';
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateQuizQuestionDto) questions: CreateQuizQuestionDto[];
  @IsOptional() @IsNumber() timeLimit?: number;
  @IsOptional() @IsNumber() passingScore?: number;
  @IsOptional() @IsNumber() maxAttempts?: number;
  @IsOptional() @IsNumber() points?: number;
  @IsOptional() @IsEnum(['beginner', 'intermediate', 'advanced']) difficulty?: 'beginner' | 'intermediate' | 'advanced';
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  order: number;
  @IsOptional() @IsEnum(['draft', 'published']) status?: 'draft' | 'published';
  @IsOptional() @IsNumber() estimatedTime?: number;
}

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
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateQuizDto) quizzes?: CreateQuizDto[];
}

export class CreateModuleDto {
  @IsString() id: string;
  @IsString() title: string;
  order: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateLessonDto) lessons: CreateLessonDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateQuizDto) quizzes?: CreateQuizDto[];
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
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateQuizDto) quizzes?: CreateQuizDto[];
  @IsOptional() @IsNumber() totalLearners?: number;
  @IsOptional() @IsNumber() rating?: number;
  @IsOptional() @IsNumber() totalLessons?: number;
  @IsOptional() @IsNumber() totalDuration?: number;
  @IsOptional() @IsNumber() totalViews?: number;
  @IsOptional() thumbnail?: string;
} 