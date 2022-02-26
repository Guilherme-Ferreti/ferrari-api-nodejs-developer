import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidNumber } from 'utils/number-validation';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
    constructor (private prisma: PrismaService) {}

    async findOne(id: number) {
        const contact = await this.prisma.contact.findUnique({
            where: {
                id: isValidNumber(id),
            }
        });

        if (! contact) {
            throw new NotFoundException('Contact not found.');
        }

        return contact;
    }

    async findAll() {
        return this.prisma.contact.findMany();
    }

    async findAllWherePerson(personId: number) {
        return this.prisma.contact.findMany({
            where: {
                personId: isValidNumber(personId),
            }
        });
    }

    async findOneWhereEmail(email: string) {
        return this.prisma.contact.findFirst({
            where: { email },
        });
    }

    async create(data: CreateContactDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        let personId;

        if (user) {
            personId = +user.personId;
        } else {
            const contact = await this.findOneWhereEmail(data.email);

            if (contact) {
                personId = +contact.personId;
            } else {
                const newPerson = await this.prisma.person.create({
                    data: {
                        name: data.name,
                    },
                });
            
                personId = +newPerson.id;
            }
        }

        return this.prisma.contact.create({
            data: {
                personId,
                email: data.email,
                message: data.message,
            },
        });
    }

    async delete(id: number) {
        await this.findOne(id);

        return this.prisma.contact.delete({
            where: {
                id: isValidNumber(id),
            },
        });
    }
}
