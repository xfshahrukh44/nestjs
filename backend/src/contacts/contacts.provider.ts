import {Connection} from "mongoose";
import {ContactSchema} from "./contacts.schema";

export const contactProviders = [
    {
        provide: 'CONTACT_MODEL',
        useFactory: (connection: Connection) => connection.model('contacts', ContactSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
