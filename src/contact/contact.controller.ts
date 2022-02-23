import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  async list() {
    return this.contactService.list();
  }

  @Get(':id')
  async show(@Param('id') id) {
    return this.contactService.get(id);
  }

  @Post()
  async create(
    @Body('name') name, 
    @Body('email') email, 
    @Body('message') message
  ) {
    return this.contactService.create({
      name, email, message
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param('id') id) {
    await this.contactService.delete(id);
  }
}
