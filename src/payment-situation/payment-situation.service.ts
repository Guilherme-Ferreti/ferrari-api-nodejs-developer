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

    async findAll() {
        return this.prisma.paymentSituation.findMany();
    }

    async findOne(id: number) {
        const paymentSituation = await this.prisma.paymentSituation.findUnique({
            where: { id },
        });

        if (! paymentSituation) {
            throw new BadRequestException('Payment Situation not found.');
        }

        return paymentSituation;
    }

    validatePaymentSituationData(data: CreatePaymentSituationDto) {
        if (! data.name) {
            throw new BadRequestException('Name is required.');
        }

        return data as CreatePaymentSituationDto;
    }
}
