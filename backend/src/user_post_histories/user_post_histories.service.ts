import {Inject, Injectable} from '@nestjs/common';
import { CreateUserPostHistoryDto } from './dto/create-user_post_history.dto';
import { UpdateUserPostHistoryDto } from './dto/update-user_post_history.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {userPostHistoryCommonAggregations, UserPostHistoryInterface} from "./user_post_histories.schema";

@Injectable()
export class UserPostHistoriesService {
    constructor(
        @Inject('USER_POST_HISTORY_MODEL')
        private userPostHistoryModel: Model<UserPostHistoryInterface>,
    ) {}
    async create(createUserPostHistoryDto: CreateUserPostHistoryDto): Promise<any> {
        try {
            const user_post_history = await this.userPostHistoryModel.create(createUserPostHistoryDto);
            await user_post_history.save();

            return await this.findOne(user_post_history.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: any[] = [], sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.userPostHistoryModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...userPostHistoryCommonAggregations,
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
            let res =  await this.userPostHistoryModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...userPostHistoryCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'User Post History Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'User Post History Not Found'
                };
            }
        }
    }

    async update(id: string, updateUserPostHistoryDto: UpdateUserPostHistoryDto): Promise<any> {
        try {
            const user_post_history = await this.findOne(id);

            if (user_post_history.error) {
                return user_post_history;
            }

            await this.userPostHistoryModel.findOneAndUpdate({ _id: id }, updateUserPostHistoryDto).exec();

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
            const user_post_history = await this.findOne(id);

            if (user_post_history.error) {
                return user_post_history;
            }

            return await this.userPostHistoryModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
