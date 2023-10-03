import {Connection} from "mongoose";
import {TranslationSchema} from "./translations.schema";

export const translationProviders = [
    {
        provide: 'TRANSLATION_MODEL',
        useFactory: (connection: Connection) => connection.model('translations', TranslationSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
