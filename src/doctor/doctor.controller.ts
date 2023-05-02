import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Query,
  UseGuards,
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
    const { appointmentDate, appointmentTime, appointmentType, forPerson } =
      createAppointmentDto;
    return this.doctorService.bookAppointment(
      id,
      appointmentTime,
      appointmentDate,
      appointmentType,
      forPerson,
    );
  }

  @Delete(':appointmentId')
  @UseGuards(AuthGuard)
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
  ): Promise<Doctor> {
    return this.doctorService.cancelAppointment(appointmentId);
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
