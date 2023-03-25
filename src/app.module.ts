import config from './config/keys';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { PatientDetailsController } from './patient-details/patient-details.controller';
// import { PatientDetailsService } from './patient-details/patient-details.service';
import { PatientDetailsModule } from './patient-details/patient-details.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI),
    AuthModule,
    PatientDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
