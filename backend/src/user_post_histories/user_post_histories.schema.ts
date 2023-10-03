import * as mongoose from 'mongoose';

export const UserPostHistorySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface UserPostHistoryInterface extends mongoose.Document {
    readonly user_id: String,
    readonly post_id: Boolean,
    readonly created_at: String,
}

export const userPostHistoryCommonAggregations = [
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
            from: 'posts',
            localField: 'post_id',
            foreignField: '_id',
            as: 'post',
        }
    },
    {
        $addFields: {
            post: {
                $arrayElemAt: ["$post", 0]
            }
        }
    }
];
