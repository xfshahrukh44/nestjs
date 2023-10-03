import {forwardRef, Module} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import {messageProviders} from "./messages.provider";
import {DatabaseModule} from "../database/database.module";
import {GroupsModule} from "../groups/groups.module";
import {UsersModule} from "../users/users.module";
import {NotificationsModule} from "../notifications/notifications.module";

@Module({
    imports: [DatabaseModule, NotificationsModule, forwardRef(() => GroupsModule), UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, ...messageProviders],
    exports: [MessagesService],
})
export class MessagesModule {}
