import { Module, forwardRef } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import {DatabaseModule} from "../database/database.module";
import {groupProviders} from "./groups.provider";
import {MessagesModule} from "../messages/messages.module";
import {UsersModule} from "../users/users.module";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
    imports: [DatabaseModule, MessagesModule, UsersModule, CacheModule.register()],
  controllers: [GroupsController],
  providers: [GroupsService, ...groupProviders],
    exports: [GroupsService],
})
export class GroupsModule {}
