import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddressService } from 'src/address/address.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeOptionService } from 'src/time-option/time-option.service';
import { isValidNumber } from 'utils/number-validation';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
    constructor (
        private prisma: PrismaService,
        private timeOptionService: TimeOptionService,
        private addressService: AddressService
    ) {}

    async findAll() {
        return this.prisma.schedule.findMany();
    }

    async findAllWherePerson(personId: number) {
        return this.prisma.schedule.findMany({
            where: { 
                personId: isValidNumber(personId),
            }
        });
    }

    async findOne(id: number) {
        const schedule = await this.prisma.schedule.findUnique({
            where: { id },
        });

        if (! schedule) {
            throw new NotFoundException('Schedule not found.');
        }
    
        return schedule;
    }

    async create(data: CreateScheduleDto, personId: number) {
        await this.timeOptionService.findOne(data.timeOptionId);
        await this.addressService.findOneWherePerson(data.billingAddressId, personId);
        
        data.scheduleAt = new Date(data.scheduleAt);
        
        const existingSchedule = await this.prisma.schedule.findFirst({
            where: { 
                scheduleAt: data.scheduleAt
            },
        });

        if (existingSchedule) {
            throw new BadRequestException('Schedule date already choosen.');
        }

        const schedule = await this.prisma.schedule.create({
            data: {
                timeOptionId: isValidNumber(data.timeOptionId),
                paymentSituationId: isValidNumber(data.paymentSituationId),
                billingAddressId: isValidNumber(data.billingAddressId),
                scheduleAt: data.scheduleAt,
                total: isValidNumber(data.total),
                installments: isValidNumber(data.installments),
                personId: isValidNumber(personId),
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

    async delete(id: number, personId: number) {
        await this.isValidPerson(id, personId);

        return this.prisma.schedule.delete({
            where: { id }
        });
    }

    async isValidPerson(id: number, personId: number) {
        personId = isValidNumber(personId);

        const schedule = await this.findOne(id);

        if (schedule.personId != personId) {
            throw new BadRequestException('Operation is invalid.');
        }

        return true;
    }
}
