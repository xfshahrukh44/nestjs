import {forwardRef, Module} from '@nestjs/common';
import { UserPostHistoriesService } from './user_post_histories.service';
import { UserPostHistoriesController } from './user_post_histories.controller';
import {DatabaseModule} from "../database/database.module";
import {UsersModule} from "../users/users.module";
import {userPostHistoryProviders} from "./user_post_histories.provider";
import {PostsModule} from "../posts/posts.module";

@Module({
    imports: [DatabaseModule, UsersModule, forwardRef(() => PostsModule)],
  controllers: [UserPostHistoriesController],
  providers: [UserPostHistoriesService, ...userPostHistoryProviders],
    exports: [UserPostHistoriesService],
})
export class UserPostHistoriesModule {}
