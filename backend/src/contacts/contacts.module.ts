import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import {DatabaseModule} from "../database/database.module";
import {contactProviders} from "./contacts.provider";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [DatabaseModule, UsersModule],
  controllers: [ContactsController],
  providers: [ContactsService, ...contactProviders],
    exports: [ContactsService],
})
export class ContactsModule {}
