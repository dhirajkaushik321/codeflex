import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Page, PageSchema } from './page.schema';
import { Quiz, QuizSchema } from './quiz.schema';

@Schema({ _id: false })
export class Lesson {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [PageSchema], default: [] })
  pages: Page[];

  @Prop({ type: [QuizSchema], default: [] })
  quizzes: Quiz[];
}

export type LessonDocument = Lesson & Document;
export const LessonSchema = SchemaFactory.createForClass(Lesson); 