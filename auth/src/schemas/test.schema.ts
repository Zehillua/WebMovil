import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Test extends Document {
  @Prop({ required: true })
  mensaje: string; // Campo para almacenar el texto enviado desde el frontend
}

export const TestSchema = SchemaFactory.createForClass(Test);