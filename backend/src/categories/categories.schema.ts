import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
    name: mongoose.Schema.Types.String,
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        nullable: true
    },
    is_active: {
        type: mongoose.Schema.Types.Boolean,
        default: true
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface CategoryInterface extends mongoose.Document {
    readonly name: String,
    readonly parent_id: String,
    readonly is_active: Boolean,
    readonly created_at: String,
}

export const categoryCommonAggregations = [
    {
        $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'children'
        }
    },
    {
        $lookup: {
            from: 'categories',
            localField: 'parent_id',
            foreignField: '_id',
            as: 'parent',
        }
    },
    {
        $addFields: {
            parent: {
                $arrayElemAt: ["$parent", 0]
            }
        }
    }
];
