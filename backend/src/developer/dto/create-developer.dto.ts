import { IsEmail, IsString, IsOptional, IsArray, MinLength } from 'class-validator';

export class CreateDeveloperDto {
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
}

export class UpdateDeveloperProfileDto {
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
} 