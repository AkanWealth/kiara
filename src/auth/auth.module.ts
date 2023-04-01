import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schema/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { MailerModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
