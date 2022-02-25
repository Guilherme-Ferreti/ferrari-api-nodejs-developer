import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidNumber } from 'utils/number-validation';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
    constructor (private prisma: PrismaService) {}

    async create(data: CreateScheduleDto, user) {
        const schedule = await this.prisma.schedule.create({
            data: {
                timeOptionId: isValidNumber(data.timeOptionId),
                paymentSituationId: isValidNumber(data.paymentSituationId),
                billingAddressId: isValidNumber(data.billingAddressId),
                scheduleAt: new Date(data.scheduleAt),
                total: isValidNumber(data.total),
                installments: isValidNumber(data.installments),
                personId: +user.personId,
            },
        });

        if (schedule) {
            data.services.split(',').forEach(async serviceId => {
                await this.prisma.scheduleService.create({
                    data: {
                        scheduleId: schedule.id,
                        serviceId: +serviceId,
                    },
                });
            });
        }

        return schedule;
    }
}
