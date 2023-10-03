import * as mongoose from 'mongoose';

export const TranslationSchema = new mongoose.Schema({
    module: mongoose.Schema.Types.String,
    module_id: mongoose.Schema.Types.ObjectId,
    language_id: {
        type: mongoose.Schema.Types.Number,
        default: 1
    },
    url: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface TranslationInterface extends mongoose.Document {
    readonly module: String,
    readonly module_id: String,
    readonly language_id: Number,
    readonly url: String,
    readonly created_at: String,
}

export const translationCommonAggregations = [

];
