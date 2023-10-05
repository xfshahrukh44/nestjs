import {Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Inject} from '@nestjs/common';
import { UserPostHistoriesService } from './user_post_histories.service';
import { CreateUserPostHistoryDto } from './dto/create-user_post_history.dto';
import { UpdateUserPostHistoryDto } from './dto/update-user_post_history.dto';
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {UsersService} from "../users/users.service";
import {PostsService} from "../posts/posts.service";
import {Model} from "mongoose";
import {UserPostHistoryInterface} from "./user_post_histories.schema";
import {AdminGuard} from "../auth/admin.guard";

@ApiTags('User Post Histories')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user-post-histories')
    export class UserPostHistoriesController {
    constructor(
        private readonly userPostHistoriesService: UserPostHistoriesService,
        private readonly usersService: UsersService,
        private readonly postsService: PostsService,
        @Inject('USER_POST_HISTORY_MODEL')
        private userPostHistoryModel: Model<UserPostHistoryInterface>,
    ) {}

    @Post()
    async create(@Body() createUserPostHistoryDto: CreateUserPostHistoryDto) {
        let redundancy_check = await this.userPostHistoryModel.aggregate([
            { $limit: 1 },
            { $match: { user_id: createUserPostHistoryDto.user_id, post_id: createUserPostHistoryDto.post_id } }
        ]).exec();

        if (redundancy_check.length == 1) {
            let updateUserPostHistoryDto = new UpdateUserPostHistoryDto();
            updateUserPostHistoryDto.created_at = Date.now().toString();
            await this.userPostHistoriesService.update(redundancy_check[0].id, updateUserPostHistoryDto);

            let res = await this.userPostHistoriesService.findOne(redundancy_check[0].id);

            return {
                success: !res.error,
                message: res.error ? res.error : 'User Post History created successfully!',
                data: res.error ? [] : res,
            }
        }

        let user = await this.usersService.findOne(createUserPostHistoryDto.user_id);
        if (user.error){
            return {
                success: false,
                message: user.error,
                data: [],
            }
        }

        let post = await this.postsService.findOne(createUserPostHistoryDto.post_id);
        if (post.error){
            return {
                success: false,
                message: post.error,
                data: [],
            }
        }

        createUserPostHistoryDto.created_at = Date.now().toString();
        let res = await this.userPostHistoriesService.create(createUserPostHistoryDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'User Post History created successfully!',
            data: res.error ? [] : res,
        }
    }

    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'limit', required: false})
    @Get()
    async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        let res = await this.userPostHistoriesService.findAll(page, limit);

        return {
            success: true,
            message: '',
            ...res
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        let res = await this.userPostHistoriesService.findOne(id);

        return {
            success: !res.error,
            message: res.error ? res.error : '',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AdminGuard)
    @Post(':id')
    async update(@Param('id') id: string, @Body() updateUserPostHistoryDto: UpdateUserPostHistoryDto) {
        let user_post_history = await this.userPostHistoriesService.findOne(id);
        if (user_post_history.error) {
            return {
                success: false,
                message: user_post_history.error,
                data: [],
            }
        }

        let res = await this.userPostHistoriesService.update(id, updateUserPostHistoryDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'User Post History updated successfully!',
            data: res.error ? [] : res,
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        let user_post_history = await this.userPostHistoriesService.findOne(id);
        if (user_post_history.error) {
            return {
                success: false,
                message: user_post_history.error,
                data: [],
            }
        }

        let res = await this.userPostHistoriesService.remove(id);

        return {
            success: !res.error,
            message: res.error ? res.error : 'User Post History deleted successfully!',
            data: res.error ? [] : res,
        }
    }
}
