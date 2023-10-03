import { config } from 'dotenv';
import * as mongoose from "mongoose";

// Load environment variables from .env file
config();

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect(process.env.MONGODB_STRING),
    },
];
