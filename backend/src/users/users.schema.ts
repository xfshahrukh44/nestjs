import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    first_name: mongoose.Schema.Types.String,
    last_name: mongoose.Schema.Types.String,
    email: mongoose.Schema.Types.String,
    phone: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    password: mongoose.Schema.Types.String,
    role_id: {
        type: mongoose.Schema.Types.Number,
        default: 2
    },
    profile_picture: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    otp: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    otp_expires_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    blocked_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    fcm_token: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    blocked_users: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    favourite_posts: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface UserInterface extends mongoose.Document {
    readonly first_name: String,
    readonly last_name: String,
    email: Boolean,
    phone: String,
    password: String,
    role_id: Number,
    readonly profile_picture: String,
    otp: String,
    readonly otp_expires_at: String,
    readonly blocked_at: String,
    readonly fcm_token: String,
    blocked_users: String,
    readonly favourite_posts: String,
    created_at: String,
}

export const userCommonAggregations = [
    {
        $match: {
            role_id: 2
        }
    }
];
