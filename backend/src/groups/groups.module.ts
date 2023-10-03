import { Module, forwardRef } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import {DatabaseModule} from "../database/database.module";
import {groupProviders} from "./groups.provider";
import {MessagesModule} from "../messages/messages.module";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [DatabaseModule, MessagesModule, UsersModule],
  controllers: [GroupsController],
  providers: [GroupsService, ...groupProviders],
    exports: [GroupsService],
})
export class GroupsModule {}
