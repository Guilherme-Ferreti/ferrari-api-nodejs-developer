import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
    constructor (private prisma: PrismaService) {}

    async create(data: CreateAddressDto) {
        data.personId = +data.personId;

        data = this.validateAddressData(data);
        
        return this.prisma.address.create({ data });
    }

    validateAddressData(data: CreateAddressDto) {
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
