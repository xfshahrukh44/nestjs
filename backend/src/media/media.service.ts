import {Inject, Injectable} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {mediaCommonAggregations, MediaInterface} from "./media.schema";

@Injectable()
export class MediaService {
    constructor(
        @Inject('MEDIA_MODEL')
        private mediaModel: Model<MediaInterface>,
    ) {}

    async create(createMediaDto: CreateMediaDto): Promise<any> {
        try {
            const media = await this.mediaModel.create(createMediaDto);
            await media.save();

            return await this.findOne(media.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: any[] = [], sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.mediaModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...mediaCommonAggregations,
            ...filter
        ]).exec();

        const totalPages = Math.ceil(res.length / limit);

        return {
            res,
            total: res.length,
            currentPage: page,
            totalPages,
        };
    }

    async findOne(id: string): Promise<any> {
        try {
            let objectId = new mongoose.Types.ObjectId(id);
            let res =  await this.mediaModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...mediaCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Media Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Media Not Found'
                };
            }
        }
    }

    async update(id: string, updateMediaDto: UpdateMediaDto): Promise<any> {
        try {
            const media = await this.findOne(id);

            if (media.error) {
                return media;
            }

            await this.mediaModel.findOneAndUpdate({ _id: id }, updateMediaDto).exec();

            return await this.findOne(id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async remove(id: string): Promise<any> {
        try {
            const media = await this.findOne(id);

            if (media.error) {
                return media;
            }

            return await this.mediaModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
