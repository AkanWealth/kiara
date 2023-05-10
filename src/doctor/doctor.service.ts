import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from './schema/doctor.model';
import { Appointment, AppointmentDocument } from './schema/appointment.model';
import { CreateDoctorDto } from './dto/doctor.dto';

interface AppointmentWithDoctor extends Appointment {
  doctorName: string;
}
@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  generateAvailability = (): string[] => {
    const startTime = moment().startOf('day'); // start of the current day
    const endTime = moment().endOf('day'); // end of the current day

    const availability = [];

    for (
      let time = moment(startTime);
      time.isBefore(endTime);
      time.add(30, 'minutes')
    ) {
      availability.push(time.format('HH:mm:ss')); // add the time value to the array as a string in the format 'HH:mm:ss'
    }

    return availability;
  };

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const availability = this.generateAvailability();
    const createdDoctor = new this.doctorModel({
      ...createDoctorDto,
      availability,
    });

    return createdDoctor.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    searchQuery?: string,
  ): Promise<{ data: Doctor[]; count: number }> {
    const skip = (page - 1) * limit;
    const query = {};
    if (searchQuery) {
      query['$or'] = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { specialty: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const [doctors, count] = await Promise.all([
      this.doctorModel.find(query).skip(skip).limit(limit).exec(),
      this.doctorModel.countDocuments(query),
    ]);

    return { data: doctors, count };
  }

  async findAllAppointment(
    page = 1,
    limit = 10,
    searchQuery?: string,
  ): Promise<{ data: AppointmentWithDoctor[]; count: number }> {
    const skip = (page - 1) * limit;
    const query = {};
    if (searchQuery) {
      query['$or'] = [
        { appointmentType: { $regex: searchQuery, $options: 'i' } },
        { forPerson: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const [appointments, count] = await Promise.all([
      this.appointmentModel.find(query).skip(skip).limit(limit).exec(),
      this.appointmentModel.countDocuments(query),
    ]);

    const doctorMap = new Map<string, Doctor>();
    const doctors = await this.doctorModel
      .find({ _id: { $in: appointments.map((a) => a.doctorId) } })
      .exec();
    doctors.forEach((doctor) => {
      doctorMap.set(doctor._id.toString(), doctor);
    });

    const data: AppointmentWithDoctor[] = appointments.map((appointment) => {
      const doctor = doctorMap.get(appointment.doctorId.toString());
      const appointmentWithDoctor: AppointmentWithDoctor = {
        ...appointment.toJSON(),
        doctorName: doctor ? doctor.name : 'Unknown Doctor',
      };
      return appointmentWithDoctor;
    });

    return { data, count };
  }

  async findById(id: string): Promise<Doctor> {
    return this.doctorModel.findById(id).exec();
  }

  async bookAppointment(
    id: string,
    appointmentTime: string,
    appointmentDate: Date,
    appointmentType: string,
    forPerson: string,
    status: string,
  ): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    const formattedTime = moment(appointmentTime, 'HH:mm:ss');
    if (!doctor.availability.includes(formattedTime.format('HH:mm:ss'))) {
      throw new BadRequestException(
        `Doctor is not available at ${formattedTime.format('HH:mm:ss')}`,
      );
    }
    const existingAppointment = await this.appointmentModel
      .findOne({
        doctorId: id,
        appointmentDate,
        appointmentTime: formattedTime.toDate(),
      })
      .exec();
    if (existingAppointment) {
      throw new BadRequestException(
        `Appointment at ${formattedTime.format('HH:mm')} already booked`,
      );
    }
    const appointment = new this.appointmentModel({
      doctorId: id,
      appointmentTime: formattedTime.toDate(),
      appointmentDate: appointmentDate,
      appointmentType: appointmentType,
      forPerson: forPerson,
      status: status,
    });
    await appointment.save();
    // remove appointmentTime from doctor's availability
    doctor.availability = doctor.availability.filter(
      (time) => time !== formattedTime.format('HH:mm:ss'),
    );
    doctor.appointments.push(appointment._id);
    const updatedDoctor = await doctor.save();
    return updatedDoctor;
  }

  // async cancelAppointment(
  //   appointmentId: string,
  //   status: string,
  // ): Promise<{
  //   name: string;
  //   specialization: string;
  //   availability: string[];
  //   appointments: string[];
  //   status: string;
  // }> {
  //   const appointment = await this.appointmentModel
  //     .findById(appointmentId)
  //     .exec();
  //   if (!appointment) {
  //     throw new NotFoundException(
  //       `Appointment with ID ${appointmentId} not found`,
  //     );
  //   }
  //   const doctor = await this.doctorModel.findById(appointment.doctorId).exec();
  //   if (!doctor) {
  //     throw new NotFoundException(
  //       `Doctor with ID ${appointment.doctorId} not found`,
  //     );
  //   }
  //   // update appointment status
  //   appointment.status = status;
  //   await appointment.save();
  //   // remove appointment from database
  //   await this.appointmentModel.deleteOne({ _id: appointmentId });
  //   // remove appointment from doctor's appointments array
  //   doctor.appointments = doctor.appointments.filter(
  //     (id) => id.toString() !== appointmentId,
  //   );
  //   // add appointment time back to doctor's availability array
  //   const formattedTime = moment(appointment.appointmentTime).format(
  //     'HH:mm:ss',
  //   );
  //   if (!doctor.availability.includes(formattedTime)) {
  //     doctor.availability.push(formattedTime);
  //     doctor.availability.sort(); // sort availability in ascending order
  //   }

  //   appointment.status = 'cancelled';
  //   const updatedDoctor = await doctor.save();
  //   return {
  //     name: updatedDoctor.name,
  //     specialization: updatedDoctor.specialization,
  //     availability: updatedDoctor.availability,
  //     appointments: updatedDoctor.appointments,
  //     status: status,
  //   };
  // }

  async cancelAppointment(appointmentId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(appointmentId)
      .exec();
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }
    appointment.status = 'cancelled';
    return await appointment.save();
  }

  async rescheduleAppointment(
    id: string,
    appointmentTime: string,
    appointmentDate: Date,
  ): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    // const formattedTime = moment(appointmentTime, 'HH:mm:ss');
    const formattedTime = moment(appointment.appointmentTime).format(
      'HH:mm:ss',
    );
    const newAppointmentDate = moment(appointmentDate, 'YYYY-MM-DD').toDate();
    const existingAppointment = await this.appointmentModel
      .findOne({
        doctorId: appointment.doctorId,
        appointmentDate: newAppointmentDate,
        appointmentTime: formattedTime,
      })
      .exec();
    if (existingAppointment) {
      throw new BadRequestException(
        `Appointment at ${formattedTime} on ${newAppointmentDate.toISOString()} already booked`,
      );
    }
    // remove appointmentTime from old appointment's doctor's availability
    const oldDoctor = await this.doctorModel
      .findById(appointment.doctorId)
      .exec();
    oldDoctor.availability.push(formattedTime);
    oldDoctor.appointments = oldDoctor.appointments.filter(
      (a) => a.toString() !== appointment._id.toString(),
    );
    await oldDoctor.save();
    // create new appointment with updated time and date
    appointment.appointmentTime = formattedTime;
    appointment.appointmentDate = newAppointmentDate;
    appointment.status = 'rescheduled';
    await appointment.save();
    // remove appointmentTime from new appointment's doctor's availability
    const newDoctor = await this.doctorModel
      .findById(appointment.doctorId)
      .exec();
    newDoctor.availability = newDoctor.availability.filter(
      (time) => time !== formattedTime,
    );
    newDoctor.appointments.push(appointment._id);
    await newDoctor.save();
    return appointment;
  }

  async searchDoctors(options: {
    name?: string;
    specialty?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Doctor[]; count: number }> {
    const { name, specialty, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = this.doctorModel.find();

    if (name) {
      query.where('name', new RegExp(name, 'i'));
    }

    if (specialty) {
      query.where('specialty', new RegExp(specialty, 'i'));
    }

    const count = await query.countDocuments();
    const data = await query.skip(skip).limit(limit).exec();

    return { data, count };
  }
}
