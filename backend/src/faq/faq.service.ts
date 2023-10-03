import {Inject, Injectable} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {faqCommonAggregations, FaqInterface} from "./faq.schema";

@Injectable()
export class FaqService {
    constructor(
        @Inject('FAQ_MODEL')
        private faqModel: Model<FaqInterface>,
    ) {}

    async create(createFaqDto: CreateFaqDto): Promise<any> {
        try {
            const faq = await this.faqModel.create(createFaqDto);
            await faq.save();

            return await this.findOne(faq.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.faqModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...faqCommonAggregations
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
            let res =  await this.faqModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...faqCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Faq Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Faq Not Found'
                };
            }
        }
    }

    async update(id: string, updateFaqDto: UpdateFaqDto): Promise<any> {
        try {
            const faq = await this.findOne(id);

            if (faq.error) {
                return faq;
            }

            await this.faqModel.findOneAndUpdate({ _id: id }, updateFaqDto).exec();

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
            const faq = await this.findOne(id);

            if (faq.error) {
                return faq;
            }

            return await this.faqModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
