import * as mongoose from 'mongoose';

export const MediaSchema = new mongoose.Schema({
    module: mongoose.Schema.Types.String,
    module_id: mongoose.Schema.Types.ObjectId,
    sub_module: {
        type: mongoose.Schema.Types.String,
        nullable: true
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

export interface MediaInterface extends mongoose.Document {
    readonly module: String,
    readonly module_id: String,
    readonly sub_module: String,
    readonly url: String,
    readonly created_at: String,
}

export const mediaCommonAggregations = [

];
