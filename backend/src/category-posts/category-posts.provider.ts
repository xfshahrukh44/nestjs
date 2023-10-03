import { Connection } from 'mongoose';
import {CategoryPostSchema} from "./category-posts.schema";

export const categoryPostProviders = [
    {
        provide: 'CATEGORY_POST_MODEL',
        useFactory: (connection: Connection) => connection.model('category_posts', CategoryPostSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
