import { Connection } from 'mongoose';
import {CategorySchema} from "./categories.schema";

export const categoryProviders = [
    {
        provide: 'CATEGORY_MODEL',
        useFactory: (connection: Connection) => connection.model('categories', CategorySchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
