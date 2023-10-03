import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'Name' })
    name: string;

    @ApiProperty({ example: 'اسم' })
    name_ar: string;

    @ApiProperty({ example: "asdsad123dasd" })
    parent_id: string;

    @ApiProperty({ example: 1 })
    is_active: boolean;

    created_at: string;
}
