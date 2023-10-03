import {Inject, Injectable} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {notificationCommonAggregations, NotificationInterface} from "./notifications.schema";

@Injectable()
export class NotificationsService {
    constructor(
        @Inject('NOTIFICATION_MODEL')
        private notificationModel: Model<NotificationInterface>,
    ) {}

    async create(createNotificationDto: CreateNotificationDto): Promise<any> {
        try {
            const notification = await this.notificationModel.create(createNotificationDto);
            await notification.save();

            return await this.findOne(notification.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.notificationModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            { $match: filter },
            ...notificationCommonAggregations
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
            let res =  await this.notificationModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...notificationCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Notification Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Notification Not Found'
                };
            }
        }
    }

    async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<any> {
        try {
            const notification = await this.findOne(id);

            if (notification.error) {
                return notification;
            }

            await this.notificationModel.findOneAndUpdate({ _id: id }, updateNotificationDto).exec();

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
            const notification = await this.findOne(id);

            if (notification.error) {
                return notification;
            }

            return await this.notificationModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
