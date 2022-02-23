import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaymentSituationController } from './payment-situation.controller';
import { PaymentSituationService } from './payment-situation.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentSituationController],
  providers: [PaymentSituationService],
  exports: [PaymentSituationService]
})
export class PaymentSituationModule {}
