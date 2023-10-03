import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
    icon: {
        type: mongoose.Schema.Types.String,
        default: process.env.APP_URL + ':' + process.env.PORT + "/images/logo.png"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: '0',
        ref: 'users'
    },
    title: mongoose.Schema.Types.String,
    content: mongoose.Schema.Types.String,
    topic: mongoose.Schema.Types.String,
    topic_id: mongoose.Schema.Types.ObjectId,
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface NotificationInterface extends mongoose.Document {
    readonly icon: String,
    readonly user_id: String,
    readonly title: Boolean,
    readonly content: String,
    readonly topic: String,
    readonly topic_id: String,
    readonly created_at: String,
}

export const notificationCommonAggregations = [
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
    }
];
