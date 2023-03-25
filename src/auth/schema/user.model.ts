import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PatientDetail } from '../../patient-details/schema/patient-details.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true })
  medicareNumber: number;

  @Prop({ unique: true })
  MedicareLineNumber: number;

  @Prop({ required: false })
  dob: Date;

  @Prop({ required: false })
  gender: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Patient' }] })
  patientDetails: PatientDetail[];
  id: any;
}

export const UserSchema = SchemaFactory.createForClass(User).set(
  'timestamps',
  true,
);
