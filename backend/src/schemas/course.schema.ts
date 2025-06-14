import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Module, ModuleSchema } from './module.schema';
import { Quiz, QuizSchema } from './quiz.schema';

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 'draft' })
  status: 'draft' | 'published' | 'archived';

  @Prop({ default: 'beginner' })
  level: 'beginner' | 'intermediate' | 'advanced';

  @Prop({ default: 0 })
  duration: number; // in minutes

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  outcomes: string[];

  @Prop({ type: [ModuleSchema], default: [] })
  modules: Module[];

  @Prop({ type: [QuizSchema], default: [] })
  quizzes: Quiz[];

  @Prop({ required: true })
  ownerId: string; // For multi-user support

  @Prop({ default: 0 })
  totalLearners: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  totalLessons: number;

  @Prop({ default: 0 })
  totalDuration: number;

  @Prop({ default: 0 })
  totalViews: number;

  @Prop()
  publishedAt?: Date;

  @Prop()
  thumbnail?: string;
}

export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course); 