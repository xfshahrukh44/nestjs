import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
    title: mongoose.Schema.Types.String,
    description: mongoose.Schema.Types.String,
    url: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    date: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    time: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    video: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    audio: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    image: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    pdf: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    is_featured: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface PostInterface extends mongoose.Document {
    readonly title: String,
    readonly description: String,
    readonly url: String,
    readonly date: String,
    readonly time: String,
    readonly video: String,
    readonly audio: String,
    readonly image: String,
    readonly pdf: String,
    readonly is_featured: Boolean,
    readonly created_at: String,
}

export const postCommonAggregations = [
    {
        $lookup: {
            from: 'category_posts',
            localField: '_id',
            foreignField: 'post_id',
            as: 'category_posts',
        }
    },
    {
        $lookup: {
            from: 'categories',
            localField: 'category_posts.category_id',
            foreignField: '_id',
            as: 'categories',
        }
    },
    {
        $lookup: {
            from: 'media',
            localField: '_id',
            foreignField: 'module_id',
            as: 'images',
        }
    },
    {
        $addFields: {
            $images: {
                $arrayElemAt: [
                    {
                        $filter: {
                            input: '$images',
                            as: 'images_instance',
                            cond: {
                                $eq: ['$$images_instance.module', 'post']
                            }
                        }
                    }
                ]
            }
        }
    }
];
