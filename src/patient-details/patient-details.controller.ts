import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PatientDetailsService } from './patient-details.service';
import { PatientDetail } from './schema/patient-details.model';

@Controller('patient-details')
export class PatientDetailsController {
  constructor(private readonly patientDetailsService: PatientDetailsService) {}

  @Get(':id')
  async getPatientDetails(@Param('id') id: string): Promise<PatientDetail> {
    const patient = await this.patientDetailsService.findPatientById(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  @Post()
  async createPatientDetails(
    @Body('userId') userId: string,
  ): Promise<PatientDetail> {
    const patient = await this.patientDetailsService.createPatient(userId);
    if (!patient) {
      throw new BadRequestException('Could not create patient');
    }
    return patient;
  }
}
