import { Module } from '@nestjs/common';
import { CategoryPostsService } from './category-posts.service';
import { CategoryPostsController } from './category-posts.controller';
import {DatabaseModule} from "../database/database.module";
import {UsersModule} from "../users/users.module";
import {categoryPostProviders} from "./category-posts.provider";

@Module({
    imports: [DatabaseModule, UsersModule],
  controllers: [CategoryPostsController],
  providers: [CategoryPostsService, ...categoryPostProviders],
    exports: [CategoryPostsService],
})
export class CategoryPostsModule {}
