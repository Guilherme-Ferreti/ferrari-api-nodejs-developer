import { Module } from '@nestjs/common';
import { AddressModule } from 'src/address/address.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeOptionModule } from 'src/time-option/time-option.module';
import { UserModule } from 'src/user/user.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
    imports: [PrismaModule, AuthModule, UserModule, TimeOptionModule, AddressModule],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService],
})
export class ScheduleModule {}
