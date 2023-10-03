import {Module} from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import {DatabaseModule} from "../database/database.module";
import {mediaProviders} from "./media.provider";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [DatabaseModule, UsersModule],
  controllers: [MediaController],
  providers: [MediaService, ...mediaProviders],
    exports: [MediaService],
})
export class MediaModule {}
