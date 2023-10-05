import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {DatabaseModule} from "../database/database.module";
import {postProviders} from "./posts.provider";
import {UsersModule} from "../users/users.module";
import {MediaModule} from "../media/media.module";
import {mediaProviders} from "../media/media.provider";
import {CategoriesModule} from "../categories/categories.module";
import {categoryProviders} from "../categories/categories.provider";
import {TranslationsModule} from "../translations/translations.module";
import {UserPostHistoriesModule} from "../user_post_histories/user_post_histories.module";
import {categoryPostProviders} from "../category-posts/category-posts.provider";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
    imports: [DatabaseModule, UsersModule, MediaModule, CategoriesModule, TranslationsModule, UserPostHistoriesModule, CacheModule.register()],
    controllers: [PostsController],
    providers: [PostsService, ...postProviders, ...mediaProviders, ...categoryProviders, ...categoryPostProviders],
    exports: [PostsService],
})
export class PostsModule {}
