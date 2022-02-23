import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
    constructor (private prisma: PrismaService) {}

    async create(data: CreateServiceDto) {
        return this.prisma.service.create({ 
            data: this.validateServiceData(data)
        });
    }

    async findAll() {
        return this.prisma.service.findMany();
    }

    async findOne(id: number) {
        id = Number(id);

        if (isNaN(id)) {
            throw new BadRequestException('Id is invalid.');
        }

        const service = await this.prisma.service.findUnique({
            where: {
            id,
            },
        });

        if (! service) {
            throw new BadRequestException('Service not found.');
        }

        return service;
    }

    async update(id: number, data: UpdateServiceDto) {
        await this.findOne(id);

        return this.prisma.service.update({
            where: { id },
            data: this.validateServiceData(data)
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.service.delete({
            where: { id },
        });
    }

    validateServiceData(data: CreateServiceDto | UpdateServiceDto) {
        if (! data.name) {
            throw new BadRequestException('Name is required.');
        }

        if (! data.description) {
            throw new BadRequestException('Description is required.');
        }

        if (! data.price) {
            throw new BadRequestException('Price is required.');
        }

        return data as CreateServiceDto;
    }
}
