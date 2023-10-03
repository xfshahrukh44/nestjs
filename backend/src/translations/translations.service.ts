import {Inject, Injectable} from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {
    translationCommonAggregations,
    TranslationInterface
} from "./translations.schema";

@Injectable()
export class TranslationsService {
    constructor(
        @Inject('TRANSLATION_MODEL')
        private translationModel: Model<TranslationInterface>,
    ) {}

    async create(createTranslationDto: CreateTranslationDto): Promise<any> {
        try {
            const translation = await this.translationModel.create(createTranslationDto);
            await translation.save();

            return await this.findOne(translation.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.translationModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...translationCommonAggregations
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
            let res =  await this.translationModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...translationCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Translation Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Translation Not Found'
                };
            }
        }
    }

    async findOneWhere(args): Promise<any> {
        try {
            let res = await this.translationModel.aggregate([
                ...args,
                { $limit: 1 },
                ...translationCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Translation Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Translation Not Found'
                };
            }
        }
    }

    async update(id: string, updateTranslationDto: UpdateTranslationDto): Promise<any> {
        try {
            const translation = await this.findOne(id);

            if (translation.error) {
                return translation;
            }

            await this.translationModel.findOneAndUpdate({ _id: id }, updateTranslationDto).exec();

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
            const translation = await this.findOne(id);

            if (translation.error) {
                return translation;
            }

            return await this.translationModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
