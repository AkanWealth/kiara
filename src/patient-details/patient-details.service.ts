import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PatientDetail,
  PatientDetailDocument,
} from './schema/patient-details.model';
import { User, UserDocument } from '../auth/schema/user.model';

@Injectable()
export class PatientDetailsService {
  constructor(
    @InjectModel(PatientDetail.name)
    private patientModel: Model<PatientDetailDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createPatient(userId: string): Promise<PatientDetail> {
    const createdPatient = await this.patientModel.create({});
    const savedPatient = await createdPatient.save();

    const user = await this.userModel.findById(userId);
    if (user) {
      user.patientDetails.push(savedPatient._id);
      await user.save();
    }

    return savedPatient;
  }

  async findPatientById(id: string): Promise<PatientDetail> {
    return this.patientModel.findById(id).exec();
  }
}
