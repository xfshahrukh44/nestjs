import {Inject, Injectable} from '@nestjs/common';
import { CreateGroupRequestDto } from './dto/create-group-request.dto';
import { UpdateGroupRequestDto } from './dto/update-group-request.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {groupRequestCommonAggregations, GroupRequestInterface} from "./group-requests.schema";

@Injectable()
export class GroupRequestsService {
    constructor(
        @Inject('GROUP_REQUEST_MODEL')
        private groupRequestModel: Model<GroupRequestInterface>,
    ) {}

    async create(createGroupRequestDto: CreateGroupRequestDto): Promise<any> {
        try {
            const group_request = await this.groupRequestModel.create(createGroupRequestDto);
            await group_request.save();

            return await this.findOne(group_request.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.groupRequestModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...groupRequestCommonAggregations
        ]).exec();

        const totalPages = Math.ceil(res.length / limit);

        return {
            res,
            total: res.length,
            currentPage: page,
            totalPages,
        };
    }

    async findOne(id: string, args?): Promise<any> {
        try {
            let objectId = new mongoose.Types.ObjectId(id);
            let res =  await this.groupRequestModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...groupRequestCommonAggregations,
                ...args
            ]).exec();

            return (res.length == 0) ? {
                error: 'Group Request Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Group Request Not Found'
                };
            }
        }
    }

    async update(id: string, updateGroupRequestDto: UpdateGroupRequestDto): Promise<any> {
        try {
            const group_request = await this.findOne(id);

            if (group_request.error) {
                return group_request;
            }

            await this.groupRequestModel.findOneAndUpdate({ _id: id }, updateGroupRequestDto).exec();

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
            const group_request = await this.findOne(id);

            if (group_request.error) {
                return group_request;
            }

            return await this.groupRequestModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
