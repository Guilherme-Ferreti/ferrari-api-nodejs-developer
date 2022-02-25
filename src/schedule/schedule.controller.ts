import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
    constructor (private scheduleService: ScheduleService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() data: CreateScheduleDto, @User() user) {
        return this.scheduleService.create(data, user);
    }
}
