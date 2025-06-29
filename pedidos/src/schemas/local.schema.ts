import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Local extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  direccion: string;
}

export const LocalSchema = SchemaFactory.createForClass(Local);