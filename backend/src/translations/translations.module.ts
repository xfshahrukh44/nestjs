import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import {DatabaseModule} from "../database/database.module";
import {UsersModule} from "../users/users.module";
import {translationProviders} from "./translations.provider";

@Module({
    imports: [DatabaseModule, UsersModule],
  controllers: [TranslationsController],
  providers: [TranslationsService, ...translationProviders],
    exports: [TranslationsService],
})
export class TranslationsModule {}
