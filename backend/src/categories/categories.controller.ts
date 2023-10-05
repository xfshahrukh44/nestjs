import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Headers} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {ApiBearerAuth, ApiHeader, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {IsNull} from "typeorm";
import {CreateTranslationDto} from "../translations/dto/create-translation.dto";
import {TranslationsService} from "../translations/translations.service";
import {UpdateTranslationDto} from "../translations/dto/update-translation.dto";
import {GetCategoryTranslationDto} from "./dto/get-category-translation.dto";
import mongoose from "mongoose";
import {AdminGuard} from "../auth/admin.guard";

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
    private readonly translated_columns: string[];
    constructor(
      private readonly categoriesService: CategoriesService,
      private readonly translationsService: TranslationsService,
    ) {
      this.translated_columns = ['name'];
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        if (createCategoryDto.parent_id) {
            let parent = await this.categoriesService.findOne(createCategoryDto.parent_id);

            if (parent.error) {
                return {
                    success: false,
                    message: parent.error,
                }
            }
        }

        createCategoryDto.created_at = Date.now().toString();
        let res = await this.categoriesService.create(createCategoryDto);

        //translation work
        if (!res.error) {
            let createTranslationDto = new CreateTranslationDto();
            createTranslationDto.module = 'category';
            createTranslationDto.module_id = res.id;
            createTranslationDto.language_id = 1;
            createTranslationDto.key = 'name';
            createTranslationDto.value = createCategoryDto.name;
            await this.translationsService.create(createTranslationDto);

            if (createCategoryDto.name_ar) {
                createTranslationDto.language_id = 2;
                createTranslationDto.value = createCategoryDto.name_ar;
                await this.translationsService.create(createTranslationDto);
            }
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Category created successfully!',
            data: res.error ? [] : res,
        }
    }

    @ApiHeader({ name: 'lang', required: false})
    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'limit', required: false})
    @Get()
    async findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Headers('lang') lang?: number) {
        let res = await this.categoriesService.findAll(page, limit, {
            is_active: 1
        });

        //translation work
        if(res.data) {
            let language_id = lang ?? 1;
            res.data = await Promise.all(
                res.data.map(async (category) => {
                    for (const key of this.translated_columns) {
                        let record = await this.translationsService.findOneWhere([
                            {
                                $match: {
                                    module: 'category',
                                    module_id: new mongoose.Types.ObjectId(category.id),
                                    language_id: language_id,
                                    key: key,
                                }
                            }
                        ]);

                        category[key] = record.value ?? category[key];
                    }

                    category.children = await Promise.all(
                        category.children.map(async (child) => {
                            for (const key of this.translated_columns) {
                                let record = await this.translationsService.findOneWhere([
                                    {
                                        $match: {
                                            module: 'category',
                                            module_id: new mongoose.Types.ObjectId(child.id),
                                            language_id: language_id,
                                            key: key,
                                        }
                                    }
                                ]);

                                child[key] = record.value ?? child[key];
                            }
                            return child;
                        })
                    );

                    return category;
                })
            );
        }

        return {
            success: true,
            message: '',
            ...res
        }
    }

    @Get('get-menu')
    @ApiHeader({ name: 'lang', required: false})
    async getMenu(@Headers('lang') lang?: number) {
        let res = await this.categoriesService.findAll(1, 10000, {
            parent_id: null,
            is_active: true
        });

        //translation work
        if(res.data) {
            let language_id = lang ?? 1;
            res.data = await Promise.all(
                res.data.map(async (category) => {
                    for (const key of this.translated_columns) {
                        let record = await this.translationsService.findOneWhere([
                            {
                                $match: {
                                    module: 'category',
                                    module_id: new mongoose.Types.ObjectId(category.id),
                                    language_id: language_id,
                                    key: key,
                                }
                            }
                        ]);

                        category[key] = record.value ?? category[key];
                    }

                    category.children = await Promise.all(
                        category.children.map(async (child) => {
                            for (const key of this.translated_columns) {
                                let record = await this.translationsService.findOneWhere([
                                    {
                                        $match: {
                                            module: 'category',
                                            module_id: new mongoose.Types.ObjectId(child.id),
                                            language_id: language_id,
                                            key: key,
                                        }
                                    }
                                ]);

                                child[key] = record.value ?? child[key];
                            }
                            return child;
                        })
                    );

                    return category;
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
        let res = await this.categoriesService.findOne(id);

        //translation work
        if (!res.error) {
            let language_id = lang ?? 1;
            for (const key of this.translated_columns) {
                let record = await this.translationsService.findOneWhere([
                    {
                        $match: {
                            module: 'category',
                            module_id: new mongoose.Types.ObjectId(res.id),
                            language_id: language_id,
                            key: key,
                        }
                    }
                ]);

                res[key] = record.value ?? res[key];
            }
        }

        return {
            success: !res.error,
            message: res.error ? res.error : '',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AdminGuard)
    @Post(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        if (updateCategoryDto.parent_id) {
            if (updateCategoryDto.parent_id == id) {
                return {
                    success: false,
                    message: 'Invalid parent id',
                }
            }

            let parent = await this.categoriesService.findOne(updateCategoryDto.parent_id);

            if (parent.error) {
                return {
                    success: false,
                    message: parent.error,
                }
            }
        }

        let res = await this.categoriesService.update(id, updateCategoryDto);

        //translation work
        if (!res.error) {
            let name_en_tr_res = await this.translationsService.findOneWhere([
                {
                    $match: {
                        module: 'category',
                        module_id: new mongoose.Types.ObjectId(res.id),
                        language_id: 1,
                        key: 'name'
                    }
                }
            ]);

            if (!name_en_tr_res.error) {
                let updateTranslationDto = new UpdateTranslationDto();
                updateTranslationDto.value = updateCategoryDto.name;
                await this.translationsService.update(name_en_tr_res.id, updateTranslationDto);
            }

            if (updateCategoryDto.name_ar) {
                let name_ar_tr_res = await this.translationsService.findOneWhere([
                    {
                        $match: {
                            module: 'category',
                            module_id: new mongoose.Types.ObjectId(res.id),
                            language_id: 2,
                            key: 'name'
                        }
                    }
                ]);

                if (!name_ar_tr_res.error) {
                    let updateTranslationDto = new UpdateTranslationDto();
                    updateTranslationDto.value = updateCategoryDto.name_ar;
                    await this.translationsService.update(name_ar_tr_res.id, updateTranslationDto);
                }
            }
        }

        return {
            success: !res.error,
            message: res.error ? res.error : 'Category updated successfully!',
            data: res.error ? [] : res,
        }
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        let res = await this.categoriesService.remove(id);

        //translation work
        let languages = [1, 2];
        for (const language_id of languages) {
            for (const key of this.translated_columns) {
                let record = await this.translationsService.findOneWhere([
                    {
                        $match: {
                            module: 'category',
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
            message: res.error ? res.error : 'Category deleted successfully!',
            data: res.error ? [] : res,
        }
    }

    @Post('translation/get')
    async getTranslation (@Body() getCategoryTranslationDto: GetCategoryTranslationDto) {
        let res = await this.translationsService.findOneWhere([
            {
                $match: {
                    module: 'category',
                    module_id: new mongoose.Types.ObjectId(getCategoryTranslationDto.module_id),
                    language_id: getCategoryTranslationDto.language_id,
                    key: getCategoryTranslationDto.key,
                }
            }
        ]);

        return {
            success: !res.error,
            message: res.error ? res.error : '',
            data: res.error ? [] : res,
        }
    }
}
