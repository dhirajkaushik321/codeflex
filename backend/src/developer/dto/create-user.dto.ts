import { IsEmail, IsString, IsOptional, IsArray, MinLength, IsBoolean, IsDateString, IsIn, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// Experience interface
export interface Experience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies?: string[];
}

// Education interface
export interface Education {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: string;
  description?: string;
}

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['developer', 'creator', 'admin'])
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programmingLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  frameworks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  databases?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  softSkills?: string[];

  // Legacy single experience fields
  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  yearsOfExperience?: string;

  @IsOptional()
  @IsString()
  currentRole?: string;

  @IsOptional()
  @IsString()
  company?: string;

  // New multiple experiences support
  @IsOptional()
  @IsArray()
  @Type(() => Object)
  experiences?: Experience[];

  // Legacy single education fields
  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsString()
  graduationYear?: string;

  // New multiple education support
  @IsOptional()
  @IsArray()
  @Type(() => Object)
  education?: Education[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredJobRoles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  codingInterests?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredTechnologies?: string[];

  @IsOptional()
  @IsString()
  careerGoals?: string;

  @IsOptional()
  @IsBoolean()
  isProfileComplete?: boolean;
}

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programmingLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  frameworks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  databases?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  softSkills?: string[];

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  yearsOfExperience?: string;

  @IsOptional()
  @IsString()
  currentRole?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  experiences?: Experience[];

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsString()
  graduationYear?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  education?: Education[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredJobRoles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  codingInterests?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredTechnologies?: string[];

  @IsOptional()
  @IsString()
  careerGoals?: string;

  @IsOptional()
  @IsBoolean()
  isProfileComplete?: boolean;

  @IsOptional()
  @IsEnum(['learner', 'creator', 'admin'])
  role?: string;
} 