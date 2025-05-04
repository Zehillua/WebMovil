import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Test extends Document {
  @Prop({ required: true })
  mensaje: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);
