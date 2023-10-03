import {Connection} from "mongoose";
import {NotificationSchema} from "./notifications.schema";

export const notificationProviders = [
    {
        provide: 'NOTIFICATION_MODEL',
        useFactory: (connection: Connection) => connection.model('notifications', NotificationSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
