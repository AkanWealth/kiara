import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schema/appointment.model';
import { AppointmentDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(createAppointmentDto: AppointmentDto): Promise<Appointment> {
    const { date, time, ...rest } = createAppointmentDto;
    const appointment = new this.appointmentModel({
      date,
      time,
      ...rest,
    });
    return appointment.save();
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel.find().exec();
  }

  async findOne(id: string): Promise<Appointment> {
    return this.appointmentModel.findById(id).exec();
  }

  async update(
    id: string,
    updateAppointmentDto: AppointmentDto,
  ): Promise<Appointment> {
    const { date, time, ...rest } = updateAppointmentDto;
    return this.appointmentModel
      .findByIdAndUpdate(
        id,
        {
          date,
          time,
          ...rest,
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.appointmentModel.findByIdAndDelete(id).exec();
  }
}
