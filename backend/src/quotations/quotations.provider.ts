import {Connection} from "mongoose";
import {QuotationSchema} from "./quotations.schema";

export const quotationProviders = [
    {
        provide: 'QUOTATION_MODEL',
        useFactory: (connection: Connection) => connection.model('quotations', QuotationSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
