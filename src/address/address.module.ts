import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HttpModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressModule {}
