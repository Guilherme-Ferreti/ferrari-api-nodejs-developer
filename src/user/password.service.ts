import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "./user.service";

@Injectable()
export class PasswordService {
  constructor(private userService: UserService, private mailService: MailService, private prisma: PrismaService) {}

  async checkPassword(id: number, password: string) {
    const user = await this.userService.get(id, false);

    const checked = await bcrypt.compare(password, user.password);

    if (! checked) {
      throw new UnauthorizedException('E-mail or password is incorrect!');
    }

    return true;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {
    if (! newPassword) {
      throw new BadRequestException('New password is required!');
    }

    await this.checkPassword(id, currentPassword);

    return this.updatePassword(id, newPassword);
  }

  async updatePassword(id: number, password: string) {
    const user = await this.userService.get(id);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: bcrypt.hashSync(password, 10),
      },
    });

    this.mailService.send({
      to: user.email,
      subject: 'Senha alterada com sucesso!',
      template: 'password-reset-successfully',
      data: {
        name: user.person.name,
      },
    });

    return user;
  }
}