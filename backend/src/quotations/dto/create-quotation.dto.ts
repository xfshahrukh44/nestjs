import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateQuotationDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'Daily Quotation' })
    title: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'Daily Quotation' })
    title_ar: string;

    @IsNotEmpty()
    @ApiProperty({ example: '"Daily Quotation Description"' })
    description: string;

    @IsNotEmpty()
    @ApiProperty({ example: '"Daily Quotation Description"' })
    description_ar: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'John Doe' })
    author: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'John Doe' })
    author_ar: string;

    @ApiProperty({ example: 'https://localhost/quotations/audios/audio.wav' })
    audio: string;

    created_at: string;
}
