import { Body, Controller, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
export class AddressController {
    constructor (private addressService: AddressService) {}

    @Post()
    async create(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(createAddressDto);
    }
}
