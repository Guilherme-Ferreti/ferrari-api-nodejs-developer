import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressController {
    constructor (private addressService: AddressService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() createAddressDto: CreateAddressDto, @User() user) {
        return this.addressService.create(user, createAddressDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    async findAll(@User() user) {
        return this.addressService.findAll(user);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') id, @User() user) {
        return this.addressService.findOne(user, +id);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id') id, @Body() updateAddressDto: UpdateAddressDto, @User() user) {
        return this.addressService.update(user, +id, updateAddressDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async destroy(@Param('id') id, @User() user) {
        return this.addressService.delete(user, +id);
    }
}
