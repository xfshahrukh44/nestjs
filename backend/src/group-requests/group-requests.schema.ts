import * as mongoose from 'mongoose';

export const GroupRequestSchema = new mongoose.Schema({
    name: mongoose.Schema.Types.String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface GroupRequestInterface extends mongoose.Document {
    readonly user_id: String,
    readonly group_id: String,
    readonly created_at: String,
}

export const groupRequestCommonAggregations = [
    {
        $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
        }
    },
    {
        $addFields: {
            user: {
                $arrayElemAt: ["$user", 0]
            }
        }
    },
    {
        $lookup: {
            from: 'groups',
            localField: 'group_id',
            foreignField: '_id',
            as: 'group',
        }
    },
    {
        $addFields: {
            group: {
                $arrayElemAt: ["$group", 0]
            }
        }
    }
];
