import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor (private prisma: PrismaService) {}

    async create(user, data: CreateAddressDto) {
        return this.prisma.address.create({ 
            data: {
                personId: +user.personId,
                ...data,
            }
        });
    }

    async findAll(user) {
        return this.prisma.address.findMany({
            where: {
                personId: +user.personId,
            },
        });
    }

    async findOne(user, id: number) {
        const address = await this.prisma.address.findFirst({
            where: { 
                id,
                personId: +user.personId,
            },
        });

        if (! address) {
            throw new BadRequestException('Address not found.');
        }

        return address;
    }

    async update(user, id: number, data: UpdateAddressDto) {
        await this.findOne(user, id);

        return this.prisma.address.update({
            where: { id },
            data,
        });
    }

    async delete(user, id: number) {
        await this.findOne(user, id);

        return this.prisma.address.delete({
            where: { id },
        });
    }

    validateAddressData(data: CreateAddressDto | UpdateAddressDto) {
        if (! data.street) {
            throw new BadRequestException('Street is required.');
        }

        if (! data.district) {
            throw new BadRequestException('District is required.');
        }

        if (! data.city) {
            throw new BadRequestException('City is required.');
        }

        if (! data.state) {
            throw new BadRequestException('State is required.');
        }

        if (! data.country) {
            throw new BadRequestException('Country is required.');
        }

        if (! data.zipcode) {
            throw new BadRequestException('Zipcode is required.');
        }

        return data as CreateAddressDto;
    }
}
