import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

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
}
