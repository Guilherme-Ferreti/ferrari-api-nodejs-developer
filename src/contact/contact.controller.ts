import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactController {
    constructor(private contactService: ContactService) {}

    @Get()
    async findAll() {
        return this.contactService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get('/my-contacts')
    async findAllWherePerson(@User() user) {
        return this.contactService.findAllWherePerson(user.personId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id) {
        return this.contactService.findOne(id);
    }

    @Post()
    async create(@Body() data: CreateContactDto) {
        return this.contactService.create(data);
    }

    @Delete(':id')
    @HttpCode(204)
    async destroy(@Param('id', ParseIntPipe) id) {
        await this.contactService.delete(id);
    }
}
