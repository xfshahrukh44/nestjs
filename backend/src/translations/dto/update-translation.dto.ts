import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateTranslationDto } from './create-translation.dto';

export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {
    @ApiProperty({ example: 'category' })
    module: string;

    @ApiProperty({ example: 1 })
    module_id: string;

    @ApiProperty({ example: 1 })
    language_id: number;

    @ApiProperty({ example: 'title' })
    key: string;

    @ApiProperty({ example: 'Cat Title' })
    value: string;
}
