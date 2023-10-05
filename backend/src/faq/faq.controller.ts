import {Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Headers, Inject} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import {ApiBearerAuth, ApiHeader, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {MailService} from "../mail/mail.service";
import {CreateTranslationDto} from "../translations/dto/create-translation.dto";
import {UpdateTranslationDto} from "../translations/dto/update-translation.dto";
import {TranslationsService} from "../translations/translations.service";
import mongoose from "mongoose";
import {AdminGuard} from "../auth/admin.guard";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@ApiTags('FAQs')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('faq')
export class FaqController {
    private readonly translated_columns: string[];
    private readonly languages: string[];
    private readonly lang_ids: {};
  constructor(
      private readonly faqService: FaqService,
      private readonly translationsService: TranslationsService,
      @Inject(CACHE_MANAGER)
      private cacheManager: Cache
  ) {
      this.translated_columns = ['question', 'answer'];
      this.languages = ['en', 'ar'];
      this.lang_ids = {
          'en': 1,
          'ar': 2,
      };
  }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createFaqDto: CreateFaqDto) {
        let question_ar = createFaqDto.question_ar
        let answer_ar = createFaqDto.answer_ar

        delete createFaqDto.question_ar;
        delete createFaqDto.answer_ar;

        createFaqDto.created_at = Date.now().toString();
        let res = await this.faqService.create(createFaqDto);

        createFaqDto.question_ar = question_ar;
        createFaqDto.answer_ar = answer_ar;

        //translation work
        if (!res.error) {
            await this.createTranslation('faq', res.id, 1, 'question', createFaqDto.question);
            await this.createTranslation('faq', res.id, 1, 'answer', createFaqDto.answer);

            await this.createTranslation('faq', res.id, 2, 'question', createFaqDto.question_ar);
            await this.createTranslation('faq', res.id, 2, 'answer', createFaqDto.answer_ar);
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Faq created successfully!',
            data: res.error ? [] : res,
        }
    }

    @Post('ask-a-question')
    async askAQuestion(@Body() createFaqDto: CreateFaqDto) {
        // createFaqDto.created_at = Date.now().toString();
        // let res = await this.faqService.create(createFaqDto);


        let mailService = new MailService();
        let mailRes = await mailService.sendEmail('sameem-admin@mailinator.com', 'Question', createFaqDto.question);

        // return {
        //     success: !res.error,
        //     message: res.error ? res.error : 'Question submitted successfully!',
        //     data: res.error ? [] : res,
        // }

        return {
            success: mailRes,
            message: mailRes ? 'Question submitted successfully!' : 'Something went wrong.',
            data: [],
        }
    }

    @Get()
    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'limit', required: false})
    @ApiHeader({ name: 'lang', required: false})
    async findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Headers('lang') lang?: number) {
        let res: any = await this.cacheManager.get('faqs');

        if (res == null) {
            res = await this.faqService.findAll(page, limit);

            //translation work
            let language_id = lang ?? 1;
            if(res.data) {
                //get preferred language
                res.data = await Promise.all(
                    res.data.map(async (faq) => {
                        //get preferred language translation
                        faq = await this.addPreferredTranslation(faq, language_id);
                        return faq;
                    })
                );

                //get translated columns
                res.data = await Promise.all(
                    res.data.map(async (faq) => {
                        //add translated columns
                        faq = await this.addTranslatedColumns(faq);
                        return faq;
                    })
                );
            }

            await this.cacheManager.set('faqs', res, 1000);
        }

        return {
            success: true,
            message: '',
            ...res
        }
    }

    @ApiHeader({ name: 'lang', required: false})
    @Get(':id')
    async findOne(@Param('id') id: string, @Headers('lang') lang?: number) {
        let res = await this.faqService.findOne(id);

        //translation work
        if (!res.error) {
            let language_id = lang ?? 1;

            //get preferred language translation
            res = await this.addPreferredTranslation(res, language_id);

            //add translated columns
            res = await this.addTranslatedColumns(res);
        }

        return {
            success: !res.error,
            message: res.error ? res.error : '',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AdminGuard)
    @Post(':id')
    async update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
        let faq = await this.faqService.findOne(id);
        if (faq.error) {
            return {
                success: false,
                message: faq.error,
                data: [],
            }
        }

        let question_ar = updateFaqDto.question_ar
        let answer_ar = updateFaqDto.answer_ar

        delete updateFaqDto.question_ar;
        delete updateFaqDto.answer_ar;

        let res = await this.faqService.update(id, updateFaqDto);

        updateFaqDto.question_ar = question_ar;
        updateFaqDto.answer_ar = answer_ar;

        //translation work
        if (!res.error) {
            await this.updateTranslation('faq', res.id, 1, 'question', updateFaqDto.question);
            await this.updateTranslation('faq', res.id, 1, 'answer', updateFaqDto.answer);

            await this.updateTranslation('faq', res.id, 2, 'question', updateFaqDto.question_ar);
            await this.updateTranslation('faq', res.id, 2, 'answer', updateFaqDto.answer_ar);
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Faq updated successfully!',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        let faq = await this.faqService.findOne(id);
        if (faq.error) {
            return {
                success: false,
                message: faq.error,
                data: [],
            }
        }

        let res = await this.faqService.remove(id);

        //translation work
        let languages = [1, 2];
        for (const language_id of languages) {
            for (const key of this.translated_columns) {
                let record = await this.translationsService.findOneWhere([
                    {
                        $match: {
                            module: 'faq',
                            module_id: new mongoose.Types.ObjectId(id),
                            language_id: language_id,
                            key: key,
                        }
                    }
                ]);

                if (!record.error) {
                    await this.translationsService.remove(record.id);
                }
            }
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Faq deleted successfully!',
            data: res.error ? [] : res,
        }
    }

    async createTranslation (module: string, module_id: string, language_id: number, key: string, value: string) {
        if (value == null) {
            return null;
        }

        let createTranslationDto = new CreateTranslationDto();
        createTranslationDto.module = module;
        createTranslationDto.module_id = module_id;
        createTranslationDto.language_id = language_id;
        createTranslationDto.key = key;
        createTranslationDto.value = value;
        return await this.translationsService.create(createTranslationDto);
    }

    async updateTranslation (module: string, module_id: string, language_id: number, key: string, value: string) {
        if (value == null) {
            return null;
        }

        let res = await this.translationsService.findOneWhere([
            {
                $match: {
                    module: module,
                    module_id: new mongoose.Types.ObjectId(module_id),
                    language_id: language_id,
                    key: key
                }
            }
        ]);

        if (!res.error) {
            let updateTranslationDto = new UpdateTranslationDto();
            updateTranslationDto.value = value;
            return await this.translationsService.update(res.id, updateTranslationDto);
        } else {
            return await this.createTranslation(module, module_id, language_id, key, value);
        }
    }

    async addPreferredTranslation (record, language_id) {
        for (const key of this.translated_columns) {
            let res = await this.translationsService.findOneWhere([
                {
                    $match: {
                        module: 'faq',
                        module_id: new mongoose.Types.ObjectId(record.id),
                        language_id: language_id,
                        key: key,
                    }
                }
            ]);

            record[key] = res.value ?? record[key];
        }

        return record;
    }

    async addTranslatedColumns (record) {
        for (const language of this.languages) {
            for (const key of this.translated_columns) {
                let res = await this.translationsService.findOneWhere([
                    {
                        $match: {
                            module: 'faq',
                            module_id: new mongoose.Types.ObjectId(record.id),
                            language_id: this.lang_ids[language],
                            key: key,
                        }
                    }
                ]);

                record[key + '_' + language] = res.value ?? record[key];
            }
        }

        return record;
    }
}
