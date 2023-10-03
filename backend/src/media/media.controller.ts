import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post()
    async create(@Body() createMediaDto: CreateMediaDto) {
        createMediaDto.created_at = Date.now().toString();
        let res = await this.mediaService.create(createMediaDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Media created successfully!',
            data: res.error ? [] : res,
        }
    }

    @Get()
    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'limit', required: false})
    async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        let res = await this.mediaService.findAll(page, limit);

        return {
            success: true,
            message: '',
            ...res
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        let res = await this.mediaService.findOne(id);

        return {
            success: !res.error,
            message: res.error ? res.error : '',
            data: res.error ? [] : res,
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
        let media = await this.mediaService.findOne(id);
        if (media.error) {
            return {
                success: false,
                message: media.error,
                data: [],
            }
        }

        let res = await this.mediaService.update(id, updateMediaDto);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Media updated successfully!',
            data: res.error ? [] : res,
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        let media = await this.mediaService.findOne(id);
        if (media.error) {
            return {
                success: false,
                message: media.error,
                data: [],
            }
        }

        let res = await this.mediaService.remove(id);

        return {
            success: !res.error,
            message: res.error ? res.error : 'Media deleted successfully!',
            data: res.error ? [] : res,
        }
    }
}
