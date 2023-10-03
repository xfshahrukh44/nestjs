import {Inject, Injectable} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import mongoose, {Model, MongooseError} from "mongoose";
import {contactCommonAggregations, ContactInterface} from "./contacts.schema";

@Injectable()
export class ContactsService {
    constructor(
        @Inject('CONTACT_MODEL')
        private contactModel: Model<ContactInterface>,
    ) {}

    async create(createContactDto: CreateContactDto): Promise<any> {
        try {
            const contact = await this.contactModel.create(createContactDto);
            await contact.save();

            return await this.findOne(contact.id);
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }

    async findAll(page: number = 1, limit: number = 10, filter: {} = {}, sort: {} = { created_at: -1 }): Promise<any> {
        let res = await this.contactModel.aggregate([
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            ...contactCommonAggregations
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
            let res =  await this.contactModel.aggregate([
                { $match: {"_id": objectId} },
                { $limit: 1 },
                ...contactCommonAggregations
            ]).exec();

            return (res.length == 0) ? {
                error: 'Contact Not Found'
            } : res[0];
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: 'Contact Not Found'
                };
            }
        }
    }

    async update(id: string, updateContactDto: UpdateContactDto): Promise<any> {
        try {
            const contact = await this.findOne(id);

            if (contact.error) {
                return contact;
            }

            await this.contactModel.findOneAndUpdate({ _id: id }, updateContactDto).exec();

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
            const contact = await this.findOne(id);

            if (contact.error) {
                return contact;
            }

            return await this.contactModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            if (error instanceof MongooseError) {
                return {
                    error: error.message
                };
            }
        }
    }
}
