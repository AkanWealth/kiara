import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Query,
  UseGuards,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './schema/doctor.model';
import { CreateDoctorDto } from './dto/doctor.dto';
import { CreateAppointmentDto } from './dto/appiontment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Appointment } from './schema/appointment.model';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseGuards()
  async create(@Body() doctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(doctorDto);
  }

  @Get()
  // @UseGuards(AuthGuard)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('searchQuery') searchQuery?: string,
  ): Promise<{ data: Doctor[]; count: number }> {
    return this.doctorService.findAll(+page, +limit, searchQuery);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.findById(id);
  }

  @Get('all/appointments')
  // @UseGuards(AuthGuard)
  async findAllAppointment(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('searchQuery') searchQuery?: string,
  ): Promise<{ data: Appointment[]; count: number }> {
    return this.doctorService.findAllAppointment(+page, +limit, searchQuery);
  }

  @Post(':id/appointments')
  @UseGuards(AuthGuard)
  async bookAppointment(
    @Param('id') id: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Doctor> {
    const {
      appointmentDate,
      appointmentTime,
      appointmentType,
      forPerson,
      status,
    } = createAppointmentDto;
    return this.doctorService.bookAppointment(
      id,
      appointmentTime,
      appointmentDate,
      appointmentType,
      forPerson,
      status,
    );
  }

  // @Delete(':appointmentId')
  // @UseGuards(AuthGuard)
  // async cancelAppointment(
  //   @Param('appointmentId') appointmentId: string,
  // ): Promise<Doctor> {
  //   return this.doctorService.cancelAppointment(appointmentId);
  // }

  // @Delete(':id')
  // async cancelAppointment(
  //   appointmentId: string,
  // ): Promise<{ doctor: Doctor; status: string }> {
  //   const updatedDoctor = await this.doctorService.cancelAppointment(
  //     appointmentId,
  //   );
  //   if (!updatedDoctor) {
  //     throw new NotFoundException(`Doctor not found`);
  //   }
  //   return { doctor: updatedDoctor, status: 'cancelled' };
  // }

  // @Delete(':id/appointments')
  // async cancelAppointment(@Param('id') appointmentId: string): Promise<{
  //   name: string;
  //   specialization: string;
  //   availability: string[];
  //   appointments: string[];
  //   status: string;
  // }> {
  //   const updatedDoctor = await this.doctorService.cancelAppointment(
  //     appointmentId,
  //     'cancelled',
  //   );
  //   if (!updatedDoctor) {
  //     throw new NotFoundException(`Doctor not found`);
  //   }
  //   return {
  //     name: updatedDoctor.name,
  //     specialization: updatedDoctor.specialization,
  //     availability: updatedDoctor.availability,
  //     appointments: updatedDoctor.appointments,
  //     status: 'cancelled',
  //   };
  // }
  // @Delete(':id/appointments')
  // async cancelAppointment(@Param('id') appointmentId: string): Promise<{
  //   name: string;
  //   specialization: string;
  //   availability: string[];
  //   appointments: string[];
  //   status: string;
  // }> {
  //   const updatedDoctor = await this.doctorService.cancelAppointment(
  //     appointmentId,
  //   );
  //   if (!updatedDoctor) {
  //     throw new NotFoundException(`Doctor not found`);
  //   }
  //   return {
  //     name: updatedDoctor.name,
  //     specialization: updatedDoctor.specialization,
  //     availability: updatedDoctor.availability,
  //     appointments: updatedDoctor.appointments,
  //     status: 'cancelled',
  //   };
  // }

  @Delete(':id/appointments')
  async cancelAppointment(@Param('id') appointmentId: string): Promise<{
    name: string;
    specialization: string;
    availability: string[];
    appointments: string[];
    status: string;
  }> {
    const appointment = await this.doctorService.cancelAppointment(
      appointmentId,
    );
    if (!appointment) {
      throw new NotFoundException(`Appointment not found`);
    }
    return {
      name: appointment.name,
      specialization: appointment.specialization,
      availability: appointment.availability,
      appointments: appointment.appointments,
      status: 'cancelled',
    };
  }

  // async cancelAppointment(@Param('id') appointmentId: string): Promise<{
  //   name: string;
  //   specialization: string;
  //   availability: string[];
  //   appointments: string[];
  //   status: string;
  // }> {
  //   const updatedDoctor = await this.doctorService.cancelAppointment(
  //     appointmentId,
  //   );
  //   if (!updatedDoctor) {
  //     throw new NotFoundException(`Doctor not found`);
  //   }
  //   return {
  //     name: updatedDoctor.name,
  //     specialization: updatedDoctor.specialization,
  //     availability: updatedDoctor.availability,
  //     appointments: updatedDoctor.appointments,
  //     status: 'cancelled',
  //   };
  // }

  @Patch('/:id/appointment/reschedule')
  async rescheduleAppointment(
    @Param('id') id: string,
    @Body('appointmentTime') appointmentTime: string,
    @Body('appointmentDate') appointmentDate: Date,
  ): Promise<{ message: string; appointment: Appointment }> {
    const appointment = await this.doctorService.rescheduleAppointment(
      id,
      appointmentTime,
      appointmentDate,
    );
    return {
      message: 'Appointment rescheduled successfully',
      appointment,
    };
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async searchDoctors(
    @Query('name') name: string,
    @Query('specialty') specialty: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: Doctor[]; count: number }> {
    const options = {
      name,
      specialty,
      page,
      limit,
    };
    return this.doctorService.searchDoctors(options);
  }
}
