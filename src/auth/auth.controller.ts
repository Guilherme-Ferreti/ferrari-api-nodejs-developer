import { BadRequestException, Body, Controller, Post, Get, UseGuards, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { parse } from 'date-fns';
import { UserService } from 'src/user/user.service';
import { Auth } from './auth.decorator';
import { User } from './../user/user.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('auth')
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}
  
  @Post()
  async verifyEmail(@Body('email') email: string) {
    try {
      await this.userService.getByEmail(email);
      return { exists: true };
    } catch (e) {
      return { exists: false };
    }
  }

  @Post('register')
  async register(
    @Body('name') name,
    @Body('email') email,
    @Body('birthAt') birthAt,
    @Body('phone') phone,
    @Body('document') document,
    @Body('password') password,
  ) {
    if (birthAt) {
      try {
        birthAt = parse(birthAt, 'yyyy-MM-dd', new Date());
      } catch (e) {
        throw new BadRequestException('BirthAt is invalid!');
      }
    }

    const user = await this.userService.create({
      name,
      email,
      birthAt,
      phone,
      document,
      password
    });

    const token = await this.authService.getToken(user.id);

    return { user, token };
  }

  @Post('login')
  async login(@Body('email') email, @Body('password') password) {
    return this.authService.login({ email, password });
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Auth() auth, @User() user) {
    return { auth, user };
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async profile(@User() user, @Body() body) {
    if (body.birthAt) {
      body.birthAt = parse(body.birthAt, 'yyyy-MM-dd', new Date());
    }

    return this.userService.update(user.id, body);
  }

  @UseGuards(AuthGuard)
  @Put('password')
  async changePassword(@Body('currentPassword') currentPassword, @Body('newPassword') newPassword, @User('id') id) {
    return this.userService.changePassword(id, currentPassword, newPassword);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email) {
    return this.authService.recoverPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('password') password: string, @Body('token') token: string) {
    return this.authService.resetPassword({ password, token })
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo', {
    dest: './storage/photos',
    limits: {
      fileSize: 5 * 1024 * 1024,
    }
  }))
  @Put('upload-photo')
  async uploadPhoto(@User() user, @UploadedFile() photo: Express.Multer.File) {
    return this.userService.setPhoto(user.id, photo);
  }
}
