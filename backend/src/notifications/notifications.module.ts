import {forwardRef, Module} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import {DatabaseModule} from "../database/database.module";
import {notificationProviders} from "./notifications.provider";
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, ...notificationProviders],
    exports: [NotificationsService],
})
export class NotificationsModule {}
