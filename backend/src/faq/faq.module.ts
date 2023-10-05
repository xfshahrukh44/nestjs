import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import {DatabaseModule} from "../database/database.module";
import {faqProviders} from "./faq.provider";
import {UsersModule} from "../users/users.module";
import {TranslationsModule} from "../translations/translations.module";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
    imports: [DatabaseModule, UsersModule, TranslationsModule, CacheModule.register()],
  controllers: [FaqController],
  providers: [FaqService, ...faqProviders],
    exports: [FaqService],
})
export class FaqModule {}
