import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class QuizQuestion {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'essay';

  @Prop({ type: [String], default: [] })
  options?: string[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  correctAnswer?: string | number | string[];

  @Prop()
  explanation?: string;

  @Prop({ default: 1 })
  points: number;

  @Prop({ default: 'beginner' })
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

@Schema({ _id: false })
export class Quiz {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: 'multiple-choice' })
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'essay';

  @Prop({ type: [Object], default: [] })
  questions: QuizQuestion[];

  @Prop()
  timeLimit?: number; // in minutes

  @Prop({ default: 70 })
  passingScore: number; // percentage

  @Prop()
  maxAttempts?: number;

  @Prop({ default: 100 })
  points: number;

  @Prop({ default: 'beginner' })
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  order: number;

  @Prop({ default: 'draft' })
  status: 'draft' | 'published';

  @Prop()
  estimatedTime?: number; // in minutes
}

export type QuizDocument = Quiz & Document;
export const QuizSchema = SchemaFactory.createForClass(Quiz);
export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion); 