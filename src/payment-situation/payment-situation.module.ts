import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PaymentSituationController } from './payment-situation.controller';
import { PaymentSituationService } from './payment-situation.service';

@Module({
    imports: [PrismaModule, AuthModule, UserModule],
    controllers: [PaymentSituationController],
    providers: [PaymentSituationService],
    exports: [PaymentSituationService],
})
export class PaymentSituationModule {}
