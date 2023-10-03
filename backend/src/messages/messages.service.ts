import {Inject, Injectable} from '@nestjs/common';
import {CreateMessageDto} from './dto/create-message.dto';
import {UpdateMessageDto} from './dto/update-message.dto';
import {GroupsService} from "../groups/groups.service";
import mongoose, {Model, MongooseError} from "mongoose";
import {messageCommonAggregations, MessageInterface} from "./messages.schema";
import {UserInterface} from "../users/users.schema";

@Injectable()
export class MessagesService {
    constructor(
        @Inject('MESSAGE_MODEL')
        private messageModel: Model<MessageInterface>,
        @Inject('USER_MODEL')
        private userModel: Model<UserInterface>,
        private groupService: GroupsService,
    ) {}

    async create(createMessageDto: CreateMessageDto): Promise<any> {
        try {
            const message = await this.messageModel.create(createMessageDto);
            await message.save();

            return await this.findOne(message.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    // async findAll(page: number = 1, limit: number = 10, query_object = {}, withGroupMembers = false, group_id = null): Promise<any> {
    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }, withGroupMembers = false, group_id = null): Promise<any> {
        let res = await this.messageModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...messageCommonAggregations
        ]).exec();

        //populate user object in place of user_id
        let enrichedData = await Promise.all(
            res.map(async (message) => {
                const user = await this.userModel.findOne({
                    _id: message.user_id,
                    blocked_at: null
                });

                if (user && user.id) {
                    delete user.password;
                    delete user.otp;
                    delete user.email;
                    delete user.phone;
                    delete user.role_id;
                    delete user.blocked_users;
                    delete user.created_at;

                    return { ...message, user };
                }
                // else {
                //     total -= 1;
                // }
            }).filter((entry) => entry !== null && entry !== undefined),
        );

        const totalPages = Math.ceil(res.length / limit);

        let members = null;
        if (withGroupMembers && group_id) {
            let group = await this.groupService.findOne(group_id);

            if (!group.error) {
                if (group.members != null && group.members != "" && group.members != "[]") {
                    members = JSON.parse(group.members);
                } else {
                    members = null;
                }
            }
        }

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
            let res =  await this.messageModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...messageCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Message Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Message Not Found'
                };
            }
        }
    }

    async update(id: string, updateMessageDto: UpdateMessageDto): Promise<any> {
        try {
            const message = await this.findOne(id);

            if (message.error) {
                return message;
            }

            await this.messageModel.findOneAndUpdate({ _id: id }, updateMessageDto).exec();

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
            const message = await this.findOne(id);

            if (message.error) {
                return message;
            }

            return await this.messageModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
