import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}

  async get(id: number) {
    id = Number(id);

    if (isNaN(id)) {
      throw new BadRequestException('ID is required!');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        person: true,
      },
    });

    if (! user) {
      throw new NotFoundException('User not found!');
    }

    delete user.password;

    return user;
  }

  async getByEmail(email: string) {
    if (! email) {
      throw new BadRequestException('E-mail is required!');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        person: true,
      },
    });

    if (! user) {
      throw new NotFoundException('User not found!');
    }

    delete user.password;

    return user;
  }

  async create({ 
    name,
    email,
    birthAt,
    phone,
    document,
    password,
  }:{
    name: string;
    email: string;
    password: string,
    birthAt?: Date;
    phone?: string;
    document?: string;
  }) {
    if (! name) {
      throw new BadRequestException('Name is required!');
    }

    if (! email) {
      throw new BadRequestException('E-mail is required!');
    }

    if (! password) {
      throw new BadRequestException('Password is required!');
    }

    if (birthAt && birthAt.toString().toLowerCase() == 'invalid date') {
      throw new BadRequestException('BirthAt is invalid!');
    }

    let user = null;

    try {
      user = await this.getByEmail(email);
    } catch (e) {
      
    }

    if (user) {
      throw new BadRequestException('E-mail already exists!');
    }

    const createdUser = await this.prisma.user.create({
      data: {
        person: {
          create: {
            name,
            birthAt,
            document,
            phone,
          },
        },
        email,
        password: bcrypt.hashSync(password, 10),
      },
      include: {
        person: true,
      },
    });

    delete createdUser.password;

    return createdUser;
  }

  async update(id: number, { 
    name,
    email,
    birthAt,
    phone,
    document,
  }:{
    name?: string;
    email?: string;
    birthAt?: Date;
    phone?: string;
    document?: string;
  }) {
    id = Number(id);

    if (isNaN(id)) {
      throw new BadRequestException('ID is not a number!');
    }

    const personData = {} as Prisma.PersonUpdateInput;
    const userData = {} as Prisma.UserUpdateInput;

    if (name) {
      personData.name = name;
    }
    
    if (birthAt) {
      personData.birthAt = birthAt;
    }
    
    if (phone) {
      personData.phone = phone;
    }

    if (document) {
      personData.document = document;
    }

    if (email) {
      userData.email = email;
    }

    const user = await this.get(id);

    if (personData) {
      await this.prisma.person.update({
        where: {
          id: user.personId,
        },
        data: personData
      });
    }

    if (userData) {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: userData
      });
    }

    return this.get(id);
  }
}
