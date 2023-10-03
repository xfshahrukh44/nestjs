import {Connection} from "mongoose";
import {MediaSchema} from "./media.schema";

export const mediaProviders = [
    {
        provide: 'MEDIA_MODEL',
        useFactory: (connection: Connection) => connection.model('media', MediaSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
