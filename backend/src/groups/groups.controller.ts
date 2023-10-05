import {Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Inject, Request} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {MessagesService} from "../messages/messages.service";
import {AddUserDto} from "./dto/add-user.dto";
import {UsersService} from "../users/users.service";
import {IsNull} from "typeorm";
import {Model} from "mongoose";
import {GroupInterface} from "./groups.schema";
import {AdminGuard} from "../auth/admin.guard";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(
      private readonly groupsService: GroupsService,
      private readonly messageService: MessagesService,
      private readonly usersService: UsersService,
      @Inject('GROUP_MODEL')
      private groupModel: Model<GroupInterface>,
      @Inject(CACHE_MANAGER)
      private cacheManager: Cache
  ) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
      createGroupDto.created_at = Date.now().toString();
      let res = await this.groupsService.create(createGroupDto);

      return {
          success: !res.error,
          message: res.error ? res.error : 'Group created successfully!',
          data: res.error ? [] : res,
      }
  }

  @Get()
  @ApiQuery({ name: 'page', required: false})
  @ApiQuery({ name: 'limit', required: false})
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
      let res: any = await this.cacheManager.get('groups');

      if (res == null) {
          res = await this.groupsService.findAll(page, limit);

          await this.cacheManager.set('group', res, 1000);
      }

      return {
          success: true,
          message: '',
          ...res
      }
  }

  @Get('get-messages/:group_id')
  async getMessages(@Request() req, @Param('group_id') group_id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
      let group = await this.groupsService.findOne(group_id);

      if (group.error) {
          return {
              success: false,
              message: 'Group not found',
              data: []
          }
      }

      let user = await this.usersService.findOneByEmail(req.user.email);
      let blocked_users = (user.blocked_users == null) ? [] : JSON.parse(user.blocked_users);

      let res = await this.messageService.findAll(page, limit, {
          where: {
              group_id: group_id,
              blocked_at: IsNull()
          }}, {}, true, group_id);

      //filter messages of blocked users
      res.data = await Promise.all(
          res.data.map(async (message) => {
              if (!blocked_users.includes(message.user_id)) {
                  return {
                      ...message
                  }
              }
          })
      );

      return {
          success: true,
          message: '',
          ...res
      }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
      let res = await this.groupsService.findOne(id);

      return {
          success: !res.error,
          message: res.error ? res.error : '',
          data: res.error ? [] : res,
      }
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
      let group = await this.groupsService.findOne(id);
      if (group.error) {
          return {
              success: false,
              message: group.error,
              data: [],
          }
      }

      let res = await this.groupsService.update(id, updateGroupDto);

      return {
          success: !res.error,
          message: res.error ? res.error : 'Group updated successfully!',
          data: res.error ? [] : res,
      }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
      let group = await this.groupsService.findOne(id);
      if (group.error) {
          return {
              success: false,
              message: group.error,
              data: [],
          }
      }

      let res = await this.groupsService.remove(id);

      return {
          success: !res.error,
          message: res.error ? res.error : 'Group deleted successfully!',
          data: res.error ? [] : res,
      }
  }

  @UseGuards(AdminGuard)
  @Post('user/add')
  async addUser(@Body() addUserDto: AddUserDto) {
      let group = await this.groupsService.findOne(addUserDto.group_id);
      if (group.error) {
          return {
              success: false,
              message: group.error,
              data: [],
          }
      }

      let user = await this.usersService.findOne(addUserDto.user_id);
      if (user.error) {
          return {
              success: false,
              message: user.error,
              data: [],
          }
      }

      // Check if the user is already a member of the group
      let updateGroupDto = new UpdateGroupDto();
      if (group.members == null) {
          updateGroupDto.members = JSON.stringify([user.id]);
      } else {
          let members = JSON.parse(group.members);

          const isMember = members.some((member) => member === user.id);
          if (isMember) {
              return {
                  success: false,
                  message: 'User is already a member of the group.',
                  data: [],
              };
          }

          members.push(user.id);
          updateGroupDto.members = JSON.stringify(members);
      }

      // Save the updated group
      await this.groupsService.update(group.id, updateGroupDto);

      return {
          success: true,
          message: 'User added to the group successfully.',
          data: [],
      };
  }
}
