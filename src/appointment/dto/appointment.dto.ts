import { IsString, IsDate } from 'class-validator';

export class AppointmentDto {
  @IsString()
  readonly patientId: string;

  @IsString()
  readonly doctorId: string;

  @IsDate()
  readonly date: Date;

  @IsString()
  readonly time: string;

  @IsString()
  readonly type: string;
}
