import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePaymentSituationDto } from './dto/create-payment-situation.dto';
import { UpdatePaymentSituationDto } from './dto/update-payment-situation.dto';
import { PaymentSituationService } from './payment-situation.service';

@Controller('payment-situations')
export class PaymentSituationController {
    constructor (private paymentSituationService: PaymentSituationService) {}

    @Post()
    async create(@Body() data: CreatePaymentSituationDto) {
        return this.paymentSituationService.create(data);
    }

    @Get()
    async findAll() {
        return this.paymentSituationService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id) {
        return this.paymentSituationService.findOne(+id);
    }

    @Put(':id')
    async update(@Param('id') id, @Body() data: UpdatePaymentSituationDto) {
        return this.paymentSituationService.update(+id, data);
    }

    @Delete(':id')
    async destroy(@Param('id') id) {
        return this.paymentSituationService.delete(+id);
    }
}
