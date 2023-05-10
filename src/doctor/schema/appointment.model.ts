import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentDocument = Appointment & Document;
@Schema()
export class Appointment {
  @Prop({ required: true, ref: 'Doctor' })
  doctorId: string;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  appointmentTime: string;

  @Prop({ required: true })
  appointmentType: string;

  @Prop({ required: true })
  forPerson: string;

  @Prop({ required: true, default: 'Done' })
  status: string;

  @Prop({ default: Date.now })
  createdOn: Date;

  @Prop({ default: Date.now })
  updatedOn: Date;
  name: string;
  specialization: string;
  availability: string[];
  appointments: string[];
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
