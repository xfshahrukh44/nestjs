import {Connection} from "mongoose";
import {PostSchema} from "./posts.schema";

export const postProviders = [
    {
        provide: 'POST_MODEL',
        useFactory: (connection: Connection) => connection.model('posts', PostSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
