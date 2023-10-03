import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {AuthService} from "../auth/auth.service";

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService, private readonly authService: AuthService) {}

  // @Post()
  // async create(@Body() createNotificationDto: CreateNotificationDto) {
  //     let res = await this.notificationsService.create(createNotificationDto);
  //
  //     return {
  //         success: !res.error,
  //         message: res.error ? res.error : 'Notification created successfully!',
  //         data: res.error ? [] : res,
  //     }
  // }

  @Get()
  @ApiQuery({ name: 'page', required: false})
  @ApiQuery({ name: 'limit', required: false})
  async findAll(@Request() req, @Query('page') page?: number, @Query('limit') limit?: number) {
      let user = await this.authService.getUserByEmail(req.user.email);

      let res = await this.notificationsService.findAll(page, limit, { $or: [ {user_id: '0'}, {user_id: user.id} ] }, { created_at: -1 });

      return {
          success: true,
          message: '',
          ...res
      }
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //     let res = await this.notificationsService.findOne(+id);
  //
  //     return {
  //         success: !res.error,
  //         message: res.error ? res.error : '',
  //         data: res.error ? [] : res,
  //     }
  // }
  //
  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
  //     let notification = await this.notificationsService.findOne(+id);
  //     if (notification.error) {
  //         return {
  //             success: false,
  //             message: notification.error,
  //             data: [],
  //         }
  //     }
  //
  //     let res = await this.notificationsService.update(+id, updateNotificationDto);
  //
  //     return {
  //         success: !res.error,
  //         message: res.error ? res.error : 'Notification updated successfully!',
  //         data: res.error ? [] : res,
  //     }
  // }
  //
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //     let notification = await this.notificationsService.findOne(+id);
  //     if (notification.error) {
  //         return {
  //             success: false,
  //             message: notification.error,
  //             data: [],
  //         }
  //     }
  //
  //     let res = await this.notificationsService.remove(+id);
  //
  //     return {
  //         success: !res.error,
  //         message: res.error ? res.error : 'Notification deleted successfully!',
  //         data: res.error ? [] : res,
  //     }
  // }
}
