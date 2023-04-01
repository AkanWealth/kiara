import config from './config/keys';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientDetailsModule } from './patient-details/patient-details.module';
import { MailerModule } from './mail/mail.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI),
    AuthModule,
    PatientDetailsModule,
    MailerModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
