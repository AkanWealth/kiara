import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientDetailsController } from './patient-details.controller';
import { PatientDetailsService } from './patient-details.service';
import {
  PatientDetail,
  PatientDetailSchema,
} from './schema/patient-details.model';
import { User, UserSchema } from '../auth/schema/user.model';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatientDetail.name, schema: PatientDetailSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [PatientDetailsController],
  providers: [PatientDetailsService, AuthService],
})
export class PatientDetailsModule {}
