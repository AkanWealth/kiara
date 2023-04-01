import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  AppointmentReason,
  AppointmentType,
} from '../dto/enum/appointment.enum';

@Schema()
export class Appointment extends Document {
  @Prop({ required: true, ref: 'User' })
  patientId: string;

  @Prop({ required: true, ref: 'Doctor' })
  doctorId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ enum: AppointmentType })
  type: string;

  @Prop({ enum: AppointmentReason })
  reason: string;

  @Prop({ default: Date.now })
  createdOn: Date;

  @Prop({ default: Date.now })
  updatedOn: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
export type AppointmentDocument = Appointment & Document;
