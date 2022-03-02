import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatePaymentSituationDto } from './dto/create-payment-situation.dto';
import { UpdatePaymentSituationDto } from './dto/update-payment-situation.dto';
import { PaymentSituationService } from './payment-situation.service';

@Controller('payment-situations')
export class PaymentSituationController {
    constructor(private paymentSituationService: PaymentSituationService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() data: CreatePaymentSituationDto) {
        return this.paymentSituationService.create(data);
    }

    @Get()
    async findAll() {
        return this.paymentSituationService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id) {
        return this.paymentSituationService.findOne(+id);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id, @Body() data: UpdatePaymentSituationDto) {
        return this.paymentSituationService.update(+id, data);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async destroy(@Param('id', ParseIntPipe) id) {
        return this.paymentSituationService.delete(+id);
    }
}
