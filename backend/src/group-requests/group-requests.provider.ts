import {Connection} from "mongoose";
import {GroupRequestSchema} from "./group-requests.schema";

export const groupRequestProviders = [
    {
        provide: 'GROUP_REQUEST_MODEL',
        useFactory: (connection: Connection) => connection.model('group_requests', GroupRequestSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
