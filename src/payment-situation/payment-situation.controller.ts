import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePaymentSituationDto } from './dto/create-payment-situation.dto';
import { PaymentSituationService } from './payment-situation.service';

@Controller('payment-situations')
export class PaymentSituationController {
    constructor (private paymentSituationService: PaymentSituationService) {}

    @Post()
    async create(@Body() createPaymentSituationDto: CreatePaymentSituationDto) {
        return this.paymentSituationService.create(createPaymentSituationDto);
    }

    @Get()
    async findAll() {
        return this.paymentSituationService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id) {
        return this.paymentSituationService.findOne(+id);
    }
}
