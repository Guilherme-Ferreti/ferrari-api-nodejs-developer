import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { join } from 'path';
import { createReadStream, existsSync, renameSync, unlinkSync } from 'fs';

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService, private mailService: MailService) {}

  async get(id: number, removePassword: boolean = true) {
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

    if (removePassword) {
      delete user.password;
    }

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
    photo,
  }:{
    name?: string;
    email?: string;
    birthAt?: Date;
    phone?: string;
    document?: string;
    photo?: string;
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
    
    if (photo) {
      userData.photo = photo;
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

  async checkPassword(id: number, password: string) {
    const user = await this.get(id, false);

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
    const user = await this.get(id);

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

  async setPhoto(id: number, photo: Express.Multer.File) {
    if (! ['image/jpg', 'image/jpeg', 'image/png'].includes(photo.mimetype)) {
      throw new BadRequestException('Invalid file type.');
    }

    await this.removePhoto(id);

    let ext = '';

    switch (photo.mimetype) {
      case 'image/png': 
        ext = 'png';
        break;

      default:
        ext = 'jpg';
    }

    const photoName = `${photo.filename}.${ext}`;
    const from = this.getPhotoStoragePath(photo.filename);
    const to = this.getPhotoStoragePath(photoName);

    renameSync(from, to);

    return this.update(id, {
      photo: photoName,
    });
  }

  async getPhoto(id: number) {
    const { photo } = await this.get(id);

    let filePath = this.getPhotoStoragePath('../nophoto.png');

    if (photo) {
      filePath = this.getPhotoStoragePath(photo);
    }

    const file = createReadStream(this.getPhotoStoragePath(photo));

    const extension = filePath.split('.').pop();

    return {
      file,
      extension,
    }
  }

  async removePhoto(userId: number) {
    const { photo } = await this.get(userId);

    if (photo) {
      const currentPhoto = this.getPhotoStoragePath(photo);

      if (existsSync(currentPhoto)) {
        unlinkSync(currentPhoto);
      }
    }

    return this.update(userId, {
      photo: null,
    });
  }

  getPhotoStoragePath(photoName: string): string {
    return join(__dirname, '../', '../', '../', 'storage', 'photos', photoName);
  }
}
