import * as mongoose from 'mongoose';

export const CategoryPostSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }
});

export interface CategoryPostInterface extends mongoose.Document {
    readonly category_id: String,
    readonly post_id: String
}

export const categoryPostCommonAggregations = [

];
