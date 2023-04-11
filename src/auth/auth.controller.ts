import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  Patch,
  Param,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schema/user.model';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    const { email, medicareNumber, medicareLineNumber } = user;
    const existingUser = await this.authService.findByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const existingUserByMedicare = await this.authService.findByMedicareNumber(
      medicareNumber,
    );
    if (existingUserByMedicare) {
      throw new HttpException(
        'Medicare number already exists',
        HttpStatus.CONFLICT,
      );
    }
    const existingUserByMedicareLine =
      await this.authService.findByMedicareLineNumber(medicareLineNumber);
    if (existingUserByMedicareLine) {
      throw new HttpException(
        'Medicare line number already exists',
        HttpStatus.CONFLICT,
      );
    }
    const data = await this.authService.create(user);
    return data;
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ user: User; token: string }> {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.generateJwt(user);
    return { user, token };
  }

  @Get('profile/:id')
  @UseGuards(AuthGuard)
  async getProfile(@Param('id') id: string): Promise<User> {
    return this.authService.getUser(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() update: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.authService.updateUser(id, update);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void> {
    await this.authService.sendPasswordResetEmail(email);
  }

  @Post('reset-password')
  @HttpCode(204)
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    await this.authService.resetPassword(token, newPassword);
  }
}
