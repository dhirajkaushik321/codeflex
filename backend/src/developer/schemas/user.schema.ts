import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

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

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone?: string;

  @Prop()
  location?: string;

  @Prop()
  linkedinUrl?: string;

  @Prop()
  githubUrl?: string;

  @Prop()
  profilePicture?: string;

  @Prop({ type: [String], default: [] })
  programmingLanguages: string[];

  @Prop({ type: [String], default: [] })
  frameworks: string[];

  @Prop({ type: [String], default: [] })
  databases: string[];

  @Prop({ type: [String], default: [] })
  tools: string[];

  @Prop({ type: [String], default: [] })
  softSkills: string[];

  // Legacy single experience fields (for backward compatibility)
  @Prop()
  experienceLevel?: string;

  @Prop()
  yearsOfExperience?: string;

  @Prop()
  currentRole?: string;

  @Prop()
  company?: string;

  // New multiple experiences support
  @Prop({ type: [Object], default: [] })
  experiences: Experience[];

  // Legacy single education fields (for backward compatibility)
  @Prop()
  educationLevel?: string;

  @Prop()
  institution?: string;

  @Prop()
  fieldOfStudy?: string;

  @Prop()
  graduationYear?: string;

  // New multiple education support
  @Prop({ type: [Object], default: [] })
  education: Education[];

  @Prop({ type: [String], default: [] })
  preferredJobRoles: string[];

  @Prop({ type: [String], default: [] })
  codingInterests: string[];

  @Prop({ type: [String], default: [] })
  preferredTechnologies: string[];

  @Prop()
  careerGoals?: string;

  @Prop({ default: false })
  isProfileComplete: boolean;

  @Prop({ default: 'learner' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 