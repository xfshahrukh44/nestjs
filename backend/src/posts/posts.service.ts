import {Inject, Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {CategoryInterface} from "../categories/categories.schema";
import {MediaInterface} from "../media/media.schema";
import {postCommonAggregations, PostInterface} from "./posts.schema";

@Injectable()
export class PostsService {
    constructor(
        @Inject('POST_MODEL')
        private postModel: Model<PostInterface>,
        @Inject('MEDIA_MODEL')
        private mediaModel: Model<MediaInterface>,
        @Inject('CATEGORY_MODEL')
        private categoryModel: Model<CategoryInterface>,
    ) {}

    async create(createPostDto: CreatePostDto): Promise<any> {
        try {
            const post = await this.postModel.create(createPostDto);
            await post.save();

            return await this.findOne(post.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: any[] = [], sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.postModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...postCommonAggregations,
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

    async findAllNoPagination(filter: any[] = []): Promise<any> {
        return await this.postModel.aggregate([
            {$limit: 10},
            {$sort : {is_featured: -1}},
            ...postCommonAggregations,
            ...filter
        ]).exec();
    }

    async findOne(id: string): Promise<any> {
        try {
            let objectId = new mongoose.Types.ObjectId(id);
            let res =  await this.postModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...postCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Post Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Post Not Found'
                };
            }
        }
    }

    async update(id: string, updatePostDto: UpdatePostDto): Promise<any> {
        try {
            const post = await this.findOne(id);

            if (post.error) {
                return post;
            }

            await this.postModel.findOneAndUpdate({ _id: id }, updatePostDto).exec();

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
            const post = await this.findOne(id);

            if (post.error) {
                return post;
            }

            return await this.postModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAllByCategory(id: string, page: number = 1, limit: number = 10, args = {}): Promise<any> {

        // let [data, total] = await this.postRepository.findAndCount({
        //     skip: (page - 1) * limit,
        //     take: limit,
        //     order: {
        //         created_at: 'DESC',
        //         is_featured: 'DESC'
        //     },
        //     where: {
        //         categories: {
        //             id: id
        //         }
        //     }
        // });

        // const totalPages = Math.ceil(total / limit);

        // return {
        //     data,
        //     total,
        //     currentPage: page,
        //     totalPages,
        // };
    }
}
