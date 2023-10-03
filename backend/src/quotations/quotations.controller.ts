import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    Query,
    UseGuards,
    BadRequestException,
    UseInterceptors,
    Injectable,
    NestInterceptor,
    ExecutionContext, CallHandler, UploadedFiles, Headers
} from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {deleteFileFromUploads, handleUploadOnCreate, handleUploadOnUpdate} from "../helpers/helper";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {CreateTranslationDto} from "../translations/dto/create-translation.dto";
import {TranslationsService} from "../translations/translations.service";
import {UpdateTranslationDto} from "../translations/dto/update-translation.dto";

@Injectable()
export class MaxFileSizeInterceptor implements NestInterceptor {
    constructor() {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const files = request.files;

        if (files) {
            this.checkForFiles(files, files.audio, 100000000);
        }

        return next.handle().pipe(
            map((data) => {
                return data;
            }),
        );
    }

    checkForFiles(files, module, max_size) {
        if (files && module && module[0] && module[0].size > max_size) {
            throw new BadRequestException(`File size exceeds the limit of ${max_size} bytes`);
        }
    }
}

@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('quotations')
export class QuotationsController {
    private readonly translated_columns: string[];
    private readonly languages: string[];
    private readonly lang_ids: {};
    constructor(private readonly quotationsService: QuotationsService, private readonly translationsService: TranslationsService) {
        this.translated_columns = ['title', 'description', 'author'];
        this.languages = ['en', 'ar'];
        this.lang_ids = {
            'en': 1,
            'ar': 2,
        };
    }

    @UseInterceptors(
        FileFieldsInterceptor([
            {name: 'audio', maxCount: 1},
        ]),
        new MaxFileSizeInterceptor(),
    )
    @ApiConsumes('multipart/form-data')
    @ApiConsumes('application/json')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                title_ar: {type: 'string'},
                description: {type: 'string'},
                description_ar: {type: 'string'},
                author: {type: 'string'},
                author_ar: {type: 'string'},
                audio: {type: 'string', format: 'binary'}
            }
        }
    })
    @Post()
    async create(@Body() createQuotationDto: CreateQuotationDto, @UploadedFiles() files: {
        audio?: Express.Multer.File[],
    }) {
        //audio uploads
        if (files) {
            try {
                createQuotationDto.audio = await handleUploadOnCreate(files, files.audio, '/uploads/quotations/audios/');
            } catch (error) {
                throw new BadRequestException(error.message);
            }
        }

        let title_ar = createQuotationDto.title_ar
        let description_ar = createQuotationDto.description_ar
        let author_ar = createQuotationDto.author_ar
        delete createQuotationDto.title_ar;
        delete createQuotationDto.description_ar;
        delete createQuotationDto.author_ar;

        createQuotationDto.created_at = Date.now().toString();
        let res = await this.quotationsService.create(createQuotationDto);

        createQuotationDto.title_ar = title_ar;
        createQuotationDto.description_ar = description_ar;
        createQuotationDto.author_ar = author_ar;

        //translation work
        if (!res.error) {
            await this.createTranslation('quotation', res.id, 1, 'title', createQuotationDto.title);
            await this.createTranslation('quotation', res.id, 1, 'description', createQuotationDto.description);
            await this.createTranslation('quotation', res.id, 1, 'author', createQuotationDto.author);

            await this.createTranslation('quotation', res.id, 2, 'title', createQuotationDto.title_ar);
            await this.createTranslation('quotation', res.id, 2, 'description', createQuotationDto.description_ar);
            await this.createTranslation('quotation', res.id, 2, 'author', createQuotationDto.author_ar);
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Quotation created successfully!',
            data: res.error ? [] : res,
        }
    }

    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'limit', required: false})
    @ApiHeader({ name: 'lang', required: false})
    @Get()
    async findAll(@Request() req, @Query('page') page?: number, @Query('limit') limit?: number, @Headers('lang') lang?: number) {
        let language_id = lang ?? 1;
        let res = await this.quotationsService.findAll(page, limit);

        //translation work
        if(res.data) {
            //get preferred language
            res.data = await Promise.all(
                res.data.map(async (quotation) => {
                    //get preferred language translation
                    quotation = await this.addPreferredTranslation(quotation, language_id);
                    return quotation;
                })
            );

            //get translated columns
            res.data = await Promise.all(
                res.data.map(async (quotation) => {
                    //add translated columns
                    quotation = await this.addTranslatedColumns(quotation);
                    return quotation;
                })
            );
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
        let res = await this.quotationsService.findOne(id);

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

    @ApiHeader({ name: 'lang', required: false})
    @Get('/get/quotation-of-the-day')
    async getQuotationOfThaDay(@Headers('lang') lang?: number) {
        let start = new Date();
        start.setUTCHours(0,0,0,0);
        let end = new Date();
        end.setUTCHours(23,59,59,999);

        let res = await this.quotationsService.findAll(1, 1, [
            {
                $and: [
                    { created_at: { $gte: start.getTime() } },
                    { created_at: { $lte: end.getTime() } },
                ]
            }
        ]);

        if (res.data.length == 0) {
            res = await this.quotationsService.findAll(1, 1);
        }

        //translation work
        if (res.data.length > 0) {
            let language_id = lang ?? 1;

            //get preferred language translation
            res.data[0] = await this.addPreferredTranslation(res.data[0], language_id);

            //add translated columns
            res.data[0] = await this.addTranslatedColumns(res.data[0]);
        }

        return {
            success: !(res.data.length != 1),
            message: (res.data.length == 1) ? '' : 'Quotation not found.',
            data: (res.data.length == 1) ? res.data[0] : [],
        }
    }

    @UseInterceptors(
        FileFieldsInterceptor([
            {name: 'audio', maxCount: 1},
        ]),
        new MaxFileSizeInterceptor(),
    )
    @ApiConsumes('multipart/form-data')
    @ApiConsumes('application/json')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                title_ar: {type: 'string'},
                description: {type: 'string'},
                description_ar: {type: 'string'},
                author: {type: 'string'},
                author_ar: {type: 'string'},
                audio: {type: 'string', format: 'binary'}
            }
        }
    })
    @Post(':id')
    async update(@Param('id') id: string, @Body() updateQuotationDto: UpdateQuotationDto, @UploadedFiles() files: {
        audio?: Express.Multer.File[],
    }) {
        let quotation = await this.quotationsService.findOne(id);
        if (quotation.error) {
            return {
                success: false,
                message: quotation.error,
                data: [],
            }
        }

        //audio uploads
        if (files) {
            try {
                updateQuotationDto.audio = await handleUploadOnUpdate(files, files.audio, quotation.audio, '/uploads/quotations/audios/');
            } catch (error) {
                throw new BadRequestException(error.message);
            }
        }

        let title_ar = updateQuotationDto.title_ar
        let description_ar = updateQuotationDto.description_ar
        let author_ar = updateQuotationDto.author_ar
        delete updateQuotationDto.title_ar;
        delete updateQuotationDto.description_ar;
        delete updateQuotationDto.author_ar;
        let res = await this.quotationsService.update(id, updateQuotationDto);
        updateQuotationDto.title_ar = title_ar;
        updateQuotationDto.description_ar = description_ar;
        updateQuotationDto.author_ar = author_ar;

        //translation work
        if (!res.error) {
            await this.updateTranslation('quotation', res.id, 1, 'title', updateQuotationDto.title);
            await this.updateTranslation('quotation', res.id, 1, 'description', updateQuotationDto.description);
            await this.updateTranslation('quotation', res.id, 1, 'author', updateQuotationDto.author);

            await this.updateTranslation('quotation', res.id, 2, 'title', updateQuotationDto.title_ar);
            await this.updateTranslation('quotation', res.id, 2, 'description', updateQuotationDto.description_ar);
            await this.updateTranslation('quotation', res.id, 2, 'author', updateQuotationDto.author_ar);
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Quotation updated successfully!',
            data: res.error ? [] : res,
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        let quotation = await this.quotationsService.findOne(id);
        if (quotation.error) {
            return {
                success: false,
                message: quotation.error,
                data: [],
            }
        }

        // Delete uploaded file
        await deleteFileFromUploads(process.env.APP_URL + ':' + process.env.PORT, quotation.audio);

        let res = await this.quotationsService.remove(id);

        //translation work
        let languages = [1, 2];
        for (const language_id of languages) {
            for (const key of this.translated_columns) {
                let record = await this.translationsService.findOneWhere({
                    where: {
                        module: 'quotation',
                        module_id: id,
                        language_id: language_id,
                        key: key,
                    },
                });
                if (!record.error) {
                    await this.translationsService.remove(record.id);
                }
            }
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Quotation deleted successfully!',
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

        let res = await this.translationsService.findOneWhere({
            where: {
                module: module,
                module_id: module_id,
                language_id: language_id,
                key: key
            }
        });

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
            let res = await this.translationsService.findOneWhere({
                where: {
                    module: 'quotation',
                    module_id: record.id,
                    language_id: language_id,
                    key: key,
                },
            });

            record[key] = res.value ?? record[key];
        }

        return record;
    }

    async addTranslatedColumns (record) {
        for (const language of this.languages) {
            for (const key of this.translated_columns) {
                let res = await this.translationsService.findOneWhere({
                    where: {
                        module: 'quotation',
                        module_id: record.id,
                        language_id: this.lang_ids[language],
                        key: key,
                    },
                });

                record[key + '_' + language] = res.value ?? record[key];
            }
        }

        return record;
    }
}
