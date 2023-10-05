import {Controller, Get, Post, Body, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {AuthGuard} from "../auth/auth.guard";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AdminGuard} from "../auth/admin.guard";

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseGuards(AdminGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.created_at = Date.now().toString();
    let res = await this.usersService.create(createUserDto);

    return {
        success: !res.error,
        message: res.error ? res.error : 'User created successfully!',
        data: res.error ? [] : res,
    }
  }

  @Get()
  @ApiQuery({ name: 'page', required: false})
  @ApiQuery({ name: 'limit', required: false})
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    let res = await this.usersService.findAll(page, limit);

      return {
          success: true,
          message: '',
          ...res
      }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let res = await this.usersService.findOne(id);

    return {
        success: !res.error,
        message: res.error ? res.error : '',
        data: res.error ? [] : res,
    }
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    let user = await this.usersService.findOne(id);
    if (user.error) {
      return {
          success: false,
          message: user.error,
          data: [],
      }
    }

    let res = await this.usersService.update(id, updateUserDto);

      return {
          success: !res.error,
          message: res.error ? res.error : 'User updated successfully!',
          data: res.error ? [] : res,
      }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let user = await this.usersService.findOne(id);
    if (user.error) {
      return {
          success: false,
          message: user.error,
          data: [],
      }
    }

    let res = await this.usersService.remove(id);

      return {
          success: !res.error,
          message: res.error ? res.error : 'User deleted successfully!',
          data: res.error ? [] : res,
      }
  }
}
