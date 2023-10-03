import {Inject, Injectable} from '@nestjs/common';
import { CreateCategoryPostDto } from './dto/create-category-post.dto';
import { UpdateCategoryPostDto } from './dto/update-category-post.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {categoryPostCommonAggregations, CategoryPostInterface} from "./category-posts.schema";

@Injectable()
export class CategoryPostsService {
    constructor(
        @Inject('CATEGORY_POST_MODEL')
        private categoryPostModel: Model<CategoryPostInterface>,
    ) {}

    async create(createCategoryPostDto: CreateCategoryPostDto): Promise<any> {
        try {
            const category_post = await this.categoryPostModel.create(createCategoryPostDto);
            await category_post.save();

            return await this.findOne(category_post.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: any[] = [], sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.categoryPostModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...categoryPostCommonAggregations
        ]).exec();

        const totalPages = Math.ceil(res.length / limit);

        return {
            res,
            total: res.length,
            currentPage: page,
            totalPages,
        };
    }

    async findOne(id: string, args: [] = []): Promise<any> {
        try {
            let objectId = new mongoose.Types.ObjectId(id);
            let res =  await this.categoryPostModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...categoryPostCommonAggregations,
                ...args
            ]).exec();

            return (res.length == 0) ? {
                error: 'Category Post Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Category Post Not Found'
                };
            }
        }

    }

    async update(id: string, updateCategoryPostDto: UpdateCategoryPostDto): Promise<any> {
        try {
            const category_post = await this.findOne(id);

            if (category_post.error) {
                return category_post;
            }

            await this.categoryPostModel.findOneAndUpdate({ _id: id }, updateCategoryPostDto).exec();

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
            const category_post = await this.findOne(id);

            if (category_post.error) {
                return category_post;
            }

            return await this.categoryPostModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
