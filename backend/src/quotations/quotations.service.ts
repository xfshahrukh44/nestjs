import {Inject, Injectable} from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {quotationCommonAggregations, QuotationInterface} from "./quotations.schema";

@Injectable()
export class QuotationsService {
    constructor(
        @Inject('QUOTATION_MODEL')
        private quotationModel: Model<QuotationInterface>,
    ) {}

    async create(createQuotationDto: CreateQuotationDto): Promise<any> {
        try {
            const quotation = await this.quotationModel.create(createQuotationDto);
            await quotation.save();

            return await this.findOne(quotation.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: any[] = [], sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.quotationModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...quotationCommonAggregations,
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

    async findOne(id: string, args: {} = {}): Promise<any> {
        try {
            let objectId = new mongoose.Types.ObjectId(id);
            let res =  await this.quotationModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...quotationCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Quotation Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Quotation Not Found'
                };
            }
        }
    }

    async update(id: string, updateQuotationDto: UpdateQuotationDto): Promise<any> {
        try {
            const quotation = await this.findOne(id);

            if (quotation.error) {
                return quotation;
            }

            await this.quotationModel.findOneAndUpdate({ _id: id }, updateQuotationDto).exec();

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
            const quotation = await this.findOne(id);

            if (quotation.error) {
                return quotation;
            }

            return await this.quotationModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
