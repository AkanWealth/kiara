import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor, DoctorSchema } from './schema/doctor.model';
import { Appointment, AppointmentSchema } from './schema/appointment.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  providers: [DoctorService, DoctorService],
  controllers: [DoctorController],
})
export class DoctorModule {}
