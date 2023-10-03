import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateTranslationDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'category' })
    module: string;

    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    module_id: string;

    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    language_id: number;

    @IsNotEmpty()
    @ApiProperty({ example: 'title' })
    key: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'Cat Title' })
    value: string;
}
