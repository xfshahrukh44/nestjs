import {Injectable, Inject} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import mongoose, {Model, MongooseError} from "mongoose";
import {userCommonAggregations, UserInterface} from "./users.schema";

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_MODEL')
        private userModel: Model<UserInterface>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<any> {
        try {
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.userModel.create(createUserDto);
            await user.save();

            return await this.findOne(user.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.userModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...userCommonAggregations
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
            let res =  await this.userModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...userCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'User Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'User Not Found'
                };
            }
        }
    }

    async findOneByEmail(email: string, args = []): Promise<any> {
        // try {
            let res =  await this.userModel.aggregate([
                { $match: { email: email } },
                { $limit: 1 },
                ...userCommonAggregations,
                ...args
            ]).exec();

            return (res.length == 0) ? {
                error: 'User Not Found'
            } : res[0];
        // } catch (error) {
        //     console.log(error)
        //     if (error instanceof MongooseError) {
        //         return {
        //             error: 'User Not Found'
        //         };
        //     }
        // }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
        try {
            const user = await this.findOne(id);

            if (user.error) {
                return user;
            }

            await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto).exec();

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
            const user = await this.findOne(id);

            if (user.error) {
                return user;
            }

            return await this.userModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
