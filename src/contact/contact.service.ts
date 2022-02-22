import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor (private prisma: PrismaService) {}

  async create({ name, email, message }:{ name:string; email:string; message:string }) {
    if (! name) {
      throw new BadRequestException('Name is required.');
    }

    if (! email) {
      throw new BadRequestException('E-mail is required.');
    }

    if (! message) {
      throw new BadRequestException('Message is required.');
    }

    const user = await this.prisma.user.findUnique({
      select: {
        personId: true,
      },
      where: {
        email,
      },
    });

    let personId;

    if (user) {
      personId = user.personId;
    } else {
      const person = await this.prisma.person.create({
        data: {
          name,
        },
      });
      
      personId = person.id;
    }

    return this.prisma.contact.create({
      data: {
        personId: personId,
        email,
        message,
      },
    });
  }
}
