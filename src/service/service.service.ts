import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidNumber } from 'utils/number-validation';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateServiceDto) {
        return this.prisma.service.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.service.findMany();
    }

    async findOne(id: number) {
        const service = await this.prisma.service.findUnique({
            where: {
                id: isValidNumber(id),
            },
        });

        if (!service) {
            throw new NotFoundException('Service not found.');
        }

        return service;
    }

    async update(id: number, data: UpdateServiceDto) {
        await this.findOne(id);

        return this.prisma.service.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.service.delete({
            where: { id },
        });
    }
}
