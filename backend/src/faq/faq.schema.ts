import * as mongoose from 'mongoose';

export const FaqSchema = new mongoose.Schema({
    question: mongoose.Schema.Types.String,
    answer: mongoose.Schema.Types.String,
    created_at: mongoose.Schema.Types.String
});

export interface FaqInterface extends mongoose.Document {
    readonly question: String,
    readonly answer: String,
    readonly created_at: Boolean,
}

export const faqCommonAggregations = [

];
