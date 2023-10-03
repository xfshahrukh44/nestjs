import {Connection} from "mongoose";
import {UserPostHistorySchema} from "./user_post_histories.schema";

export const userPostHistoryProviders = [
    {
        provide: 'USER_POST_HISTORY_MODEL',
        useFactory: (connection: Connection) => connection.model('user_post_histories', UserPostHistorySchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
