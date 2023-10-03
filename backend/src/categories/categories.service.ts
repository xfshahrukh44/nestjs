import {Inject, Injectable} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {categoryCommonAggregations, CategoryInterface} from "./categories.schema";

@Injectable()
export class CategoriesService {
    constructor(
        @Inject('CATEGORY_MODEL')
        private categoryModel: Model<CategoryInterface>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<any> {
        try {
            const category = await this.categoryModel.create(createCategoryDto);
            await category.save();

            return await this.findOne(category.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.categoryModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...categoryCommonAggregations
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
            let res =  await this.categoryModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...categoryCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Category Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Category Not Found'
                };
            }
        }
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any> {
        try {
            const category = await this.findOne(id);

            if (category.error) {
                return category;
            }

            await this.categoryModel.findOneAndUpdate({ _id: id }, updateCategoryDto).exec();

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
            const category = await this.findOne(id);

            if (category.error) {
                return category;
            }

            return await this.categoryModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

}
