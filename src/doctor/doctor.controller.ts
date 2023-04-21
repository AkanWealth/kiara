import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './schema/doctor.model';
import { CreateDoctorDto } from './dto/doctor.dto';
import { CreateAppointmentDto } from './dto/appiontment.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  async create(@Body() doctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(doctorDto);
  }

  // @Get()
  // async findAll(
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  // ): Promise<{ doctors: Doctor[]; count: number }> {
  //   return this.doctorService.findAll(page, limit);
  // }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('searchQuery') searchQuery?: string,
  ): Promise<{ data: Doctor[]; count: number }> {
    return this.doctorService.findAll(+page, +limit, searchQuery);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.findById(id);
  }

  @Post(':id/appointments')
  async bookAppointment(
    @Param('id') id: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Doctor> {
    const { appointmentTime, appointmentType, forPerson } =
      createAppointmentDto;
    return this.doctorService.bookAppointment(
      id,
      appointmentTime,
      appointmentType,
      forPerson,
    );
  }

  @Delete(':appointmentId')
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
  ): Promise<Doctor> {
    return this.doctorService.cancelAppointment(appointmentId);
  }

  @Get('search')
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
