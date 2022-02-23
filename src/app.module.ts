import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './contact/contact.module';
import { TimeOptionModule } from './time-option/time-option.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, MailModule, ContactModule, TimeOptionModule, ServiceModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
