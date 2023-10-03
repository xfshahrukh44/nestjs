import * as mongoose from 'mongoose';

export const QuotationSchema = new mongoose.Schema({
    title: mongoose.Schema.Types.String,
    description: mongoose.Schema.Types.String,
    author: mongoose.Schema.Types.String,
    audio: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface QuotationInterface extends mongoose.Document {
    readonly title: String,
    readonly description: String,
    readonly author: String,
    readonly audio: String,
    readonly created_at: String,
}

export const quotationCommonAggregations = [

];
