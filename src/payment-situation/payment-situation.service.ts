import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentSituationDto } from './dto/create-payment-situation.dto';

@Injectable()
export class PaymentSituationService {
    constructor (private prisma: PrismaService) {}

    async create(data: CreatePaymentSituationDto) {
        data = this.validatePaymentSituationData(data);

        return this.prisma.paymentSituation.create({ data });
    }

    validatePaymentSituationData(data: CreatePaymentSituationDto) {
        if (! data.name) {
            throw new BadRequestException('Name is required.');
        }

        return data as CreatePaymentSituationDto;
    }
}
