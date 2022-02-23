import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor (private prisma: PrismaService) {}

    async create(data: CreateAddressDto) {
        data.personId = +data.personId;

        data = this.validateAddressData(data);
        
        return this.prisma.address.create({ data });
    }

    async findAll() {
        return this.prisma.address.findMany();
    }

    async findOne(id: number) {
        const address = await this.prisma.address.findUnique({
            where: { id },
        });

        if (! address) {
            throw new BadRequestException('Address not found.');
        }

        return address;
    }

    async update(id: number, data: UpdateAddressDto) {
        data = this.validateAddressData(data);

        await this.findOne(id);

        return this.prisma.address.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        await this.findOne(id);

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
