import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  Patch,
  Param,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schema/user.model';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    const data = await this.authService.create(user);
    return data;
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ token: string }> {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.generateJwt(user);
    return { token };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() request: any): Promise<User> {
    return request.user;
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