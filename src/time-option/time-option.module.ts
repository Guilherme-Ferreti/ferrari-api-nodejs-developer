import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeOptionController } from './time-option.controller';
import { TimeOptionService } from './time-option.service';

@Module({
  imports: [PrismaModule],
  controllers: [TimeOptionController],
  providers: [TimeOptionService]
})
export class TimeOptionModule {}
