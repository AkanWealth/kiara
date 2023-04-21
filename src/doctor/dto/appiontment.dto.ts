export class CreateAppointmentDto {
  readonly doctorId: string;
  readonly appointmentTime: string;
  readonly appointmentType: string;
  readonly forPerson: string;
}
