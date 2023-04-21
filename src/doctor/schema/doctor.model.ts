import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema()
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ required: true })
  availability: string[];

  @Prop({ default: [] })
  appointments: string[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
