import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePageDto {
  @IsString() id: string;
  @IsString() title: string;
  @IsString() content: string;
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
  @IsOptional() @IsString() status?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateModuleDto) modules: CreateModuleDto[];
} 