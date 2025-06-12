import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Module, ModuleSchema } from './module.schema';

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'draft' })
  status: string;

  @Prop({ type: [ModuleSchema], default: [] })
  modules: Module[];

  @Prop({ required: true })
  ownerId: string; // For multi-user support
}

export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course); 