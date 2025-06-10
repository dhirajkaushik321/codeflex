import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeveloperDocument = Developer & Document;

@Schema({ timestamps: true })
export class Developer {
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

  @Prop()
  experienceLevel?: string;

  @Prop()
  yearsOfExperience?: string;

  @Prop()
  currentRole?: string;

  @Prop()
  company?: string;

  @Prop()
  educationLevel?: string;

  @Prop()
  institution?: string;

  @Prop()
  fieldOfStudy?: string;

  @Prop()
  graduationYear?: string;

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

  @Prop({ default: 'developer' })
  role: string;
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer); 