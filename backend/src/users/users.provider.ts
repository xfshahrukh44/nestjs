import {Connection} from "mongoose";
import {UserSchema} from "./users.schema";

export const userProviders = [
    {
        provide: 'USER_MODEL',
        useFactory: (connection: Connection) => connection.model('users', UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
