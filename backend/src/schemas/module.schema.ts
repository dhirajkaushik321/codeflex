import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lesson, LessonSchema } from './lesson.schema';
import { Quiz, QuizSchema } from './quiz.schema';

@Schema({ _id: false })
export class Module {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [LessonSchema], default: [] })
  lessons: Lesson[];

  @Prop({ type: [QuizSchema], default: [] })
  quizzes: Quiz[];
}

export type ModuleDocument = Module & Document;
export const ModuleSchema = SchemaFactory.createForClass(Module); 