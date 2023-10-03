import {Inject, Injectable} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {groupCommonAggregations, GroupInterface} from "./groups.schema";

@Injectable()
export class GroupsService {
    constructor(
        @Inject('GROUP_MODEL')
        private groupModel: Model<GroupInterface>,
    ) {}

    async create(createGroupDto: CreateGroupDto): Promise<any> {
        try {
            const group = await this.groupModel.create(createGroupDto);
            await group.save();

            return await this.findOne(group.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.groupModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...groupCommonAggregations
        ]).exec();

        //modify members to array of integers
        res = await Promise.all(
            res.map(async (group) => {
                if (group.members != null && group.members != "" && group.members != "[]") {
                    group.members = JSON.parse(group.members);
                } else {
                    group.members = null;
                }

                return group;
            })
        );

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
            let res =  await this.groupModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...groupCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Group Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Group Not Found'
                };
            }
        }
    }

    async update(id: string, updateGroupDto: UpdateGroupDto): Promise<any> {
        try {
            const group = await this.findOne(id);

            if (group.error) {
                return group;
            }

            await this.groupModel.findOneAndUpdate({ _id: id }, updateGroupDto).exec();

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
            const group = await this.findOne(id);

            if (group.error) {
                return group;
            }

            return await this.groupModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
