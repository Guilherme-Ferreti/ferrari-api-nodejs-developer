import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private authService: AuthService, private userService: UserService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = request.headers['authorization'].split(' ')[1];

      if (! token) {
        throw new BadRequestException('Token is required!');
      }

      request.auth = await this.authService.decodeToken(token);

      request.user = await this.userService.get(request.auth.id);
    } catch (error) {
      return false;
    }

    return true;
  }
}
