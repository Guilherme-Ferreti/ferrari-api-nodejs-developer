import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidNumber } from 'utils/number-validation';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor (private prisma: PrismaService, private httpService: HttpService) {}

    async findAllWherePerson(personId: number) {
        return this.prisma.address.findMany({
            where: {
                personId: isValidNumber(personId),
            },
        });
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

    async findOneWherePerson(id: number, personId: number) {
        const address = await this.prisma.address.findFirst({
            where: { 
                id: isValidNumber(id),
                personId: +personId,
            },
        });

        if (! address) {
            throw new BadRequestException('Address not found.');
        }

        return address;
    }

    async create(user, data: CreateAddressDto) {
        return this.prisma.address.create({ 
            data: {
                personId: +user.personId,
                ...data,
            }
        });
    }

    async update(id: number, data: UpdateAddressDto, personId: number) {
        await this.findOneWherePerson(id, personId);

        return this.prisma.address.update({
            where: { id },
            data,
        });
    }

    async delete(id: number, personId: number) {
        await this.findOneWherePerson(id, personId);

        return this.prisma.address.delete({
            where: { id },
        });
    }

    async searchCep(cep: string) {
        cep = cep.replace(/[^\d]+/g, '').substring(0, 8);

        const response = await lastValueFrom(this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`));

        return response.data;
    }
}
