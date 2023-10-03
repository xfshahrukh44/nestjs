import * as mongoose from 'mongoose';

export const ContactSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    email: mongoose.Schema.Types.String,
    phone: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    company: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    message: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
    created_at: {
        type: mongoose.Schema.Types.String,
        nullable: true
    },
});

export interface ContactInterface extends mongoose.Document {
    readonly name: String,
    readonly email: String,
    readonly phone: String,
    readonly company: String,
    readonly message: String,
    readonly created_at: String,
}

export const contactCommonAggregations = [

];
