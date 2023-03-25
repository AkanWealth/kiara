import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = jwt.verify(token, 'secretKey');
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
