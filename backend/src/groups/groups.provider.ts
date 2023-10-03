import {Connection} from "mongoose";
import {GroupSchema} from "./groups.schema";

export const groupProviders = [
    {
        provide: 'GROUP_MODEL',
        useFactory: (connection: Connection) => connection.model('groups', GroupSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
