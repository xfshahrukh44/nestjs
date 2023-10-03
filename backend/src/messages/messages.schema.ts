import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    message: mongoose.Schema.Types.String,
    blocked_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface MessageInterface extends mongoose.Document {
    readonly group_id: String,
    readonly user_id: String,
    readonly message: String,
    readonly blocked_at: String,
    readonly created_at: String,
}

export const messageCommonAggregations = [
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
    },
    {
        $match: {
            is_blocked: null
        }
    }
];
