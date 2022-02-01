import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private authService: AuthService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = request.headers['authorization'].split(' ')[1];

      if (! token) {
        throw new BadRequestException('Token is required!');
      }

      const data = await this.authService.decodeToken(token);
    } catch (error) {
      return false;
    }

    return true;
  }
}
