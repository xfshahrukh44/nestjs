import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {DatabaseModule} from "../database/database.module";
import {categoryProviders} from "./categories.provider";
import {UsersModule} from "../users/users.module";
import {TranslationsModule} from "../translations/translations.module";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
    imports: [DatabaseModule, UsersModule, TranslationsModule, CacheModule.register()],
  controllers: [CategoriesController],
  providers: [CategoriesService, ...categoryProviders],
    exports: [CategoriesService],
})
export class CategoriesModule {}
