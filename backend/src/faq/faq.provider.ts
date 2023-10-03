import {Connection} from "mongoose";
import {FaqSchema} from "./faq.schema";

export const faqProviders = [
    {
        provide: 'FAQ_MODEL',
        useFactory: (connection: Connection) => connection.model('faqs', FaqSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
