export class CreateAppointmentDto {
  readonly doctorId: string;
  readonly appointmentTime: string;
  readonly appointmentDate: Date;
  readonly appointmentType: string;
  readonly forPerson: string;
}
