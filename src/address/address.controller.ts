import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
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
    async findOne(@Param('id', ParseIntPipe) id, @User() user) {
        return this.addressService.findOneWherePerson(+id, +user.personId);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id, @Body() updateAddressDto: UpdateAddressDto, @User() user) {
        return this.addressService.update(user, +id, updateAddressDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async destroy(@Param('id', ParseIntPipe) id, @User() user) {
        return this.addressService.delete(user, +id);
    }

    @Get('/cep/:cep')
    async cep(@Param('cep') cep: string) {
        return this.addressService.searchCep(cep);
    }
}
