import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { id } from 'date-fns/locale';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressController {
    constructor (private addressService: AddressService) {}

    @Post()
    async create(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(createAddressDto);
    }

    @Get()
    async findAll() {
        return this.addressService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id) {
        return this.addressService.findOne(+id);
    }

    @Put(':id')
    async update(@Param('id') id, @Body() updateAddressDto: UpdateAddressDto) {
        return this.addressService.update(+id, updateAddressDto);
    }

    @Delete(':id')
    async destroy(@Param('id') id) {
        return this.addressService.delete(+id);
    }
}
