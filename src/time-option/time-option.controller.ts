import { Body, Controller, Get, Post } from '@nestjs/common';
import { TimeOptionService } from './time-option.service';

@Controller('time-options')
export class TimeOptionController {
    constructor (private timeOptionService: TimeOptionService) {}

    @Get()
    async findAll() {
        return this.timeOptionService.findAll();
    }

    @Post()
    async create(@Body('day') day, @Body('time') time) {
        return this.timeOptionService.create({ day, time });
    }
}
