import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schema/user.model';

export type PatientDetailDocument = PatientDetail & Document;

@Schema()
export class PatientDetail {
  @Prop({ required: false })
  mobilePhoneNumber: string;

  @Prop({ required: false })
  homePhoneNumber: string;

  @Prop({ required: false })
  workPhoneNumber: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  postCode: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const PatientDetailSchema = SchemaFactory.createForClass(PatientDetail);
