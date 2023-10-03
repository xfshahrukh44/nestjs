import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
      createContactDto.created_at = Date.now().toString();
      let res = await this.contactsService.create(createContactDto);

      return {
          success: !res.error,
          message: res.error ? res.error : 'Contact created successfully!',
          data: res.error ? [] : res,
      }
  }

  @Get()
  @ApiQuery({ name: 'page', required: false})
  @ApiQuery({ name: 'limit', required: false})
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
      let res = await this.contactsService.findAll(page, limit);

      return {
          success: true,
          message: '',
          ...res
      }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
      let res = await this.contactsService.findOne(id);

      return {
          success: !res.error,
          message: res.error ? res.error : '',
          data: res.error ? [] : res,
      }
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
      let contact = await this.contactsService.findOne(id);
      if (contact.error) {
          return {
              success: false,
              message: contact.error,
              data: [],
          }
      }

      let res = await this.contactsService.update(id, updateContactDto);

      return {
          success: !res.error,
          message: res.error ? res.error : 'Contact updated successfully!',
          data: res.error ? [] : res,
      }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
      let contact = await this.contactsService.findOne(id);
      if (contact.error) {
          return {
              success: false,
              message: contact.error,
              data: [],
          }
      }

      let res = await this.contactsService.remove(id);

      return {
          success: !res.error,
          message: res.error ? res.error : 'Contact deleted successfully!',
          data: res.error ? [] : res,
      }
  }
}
