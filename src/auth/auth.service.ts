import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '../mail/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    await createdUser.save();
    return createdUser;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findByMedicareNumber(medicareNumber: number): Promise<User> {
    return this.userModel.findOne({ medicareNumber }).exec();
  }

  async findByMedicareLineNumber(medicareLineNumber: number): Promise<User> {
    return this.userModel.findOne({ medicareLineNumber }).exec();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return jwt.sign(payload, 'secretKey');
  }

  async updateUser(id: string, update: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    return user;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetUrl = `https://kiara.com/reset-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Use the following link to reset your password: ${resetUrl}`,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
      };
      userId = decoded.sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }
}
