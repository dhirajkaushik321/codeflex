import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Page {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  order: number;

  @Prop({ default: '' })
  content: string; // HTML from Quill
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page); 