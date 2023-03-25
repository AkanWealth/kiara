import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
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
}
