import * as mongoose from 'mongoose';

export const GroupSchema = new mongoose.Schema({
    name: mongoose.Schema.Types.String,
    default_icon: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    last_message: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    last_updated: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    members: {
        type: mongoose.Schema.Types.String,
        default: '[]'
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface GroupInterface extends mongoose.Document {
    readonly name: String,
    readonly default_icon: String,
    readonly last_message: String,
    readonly last_updated: String,
    readonly members: String,
    readonly created_at: String,
}

export const groupCommonAggregations = [

];
