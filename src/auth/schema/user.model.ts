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

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  passcode: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  homePhone: string;

  @Prop({ required: true })
  workPhone: string;

  @Prop({ required: true })
  mobilePhone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true })
  medicareNumber: number;

  @Prop({ unique: true })
  medicareLineNumber: number;

  @Prop({ required: false })
  dob: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Patient' }] })
  patientDetails: PatientDetail[];
  id: any;
}

export const UserSchema = SchemaFactory.createForClass(User).set(
  'timestamps',
  true,
);
