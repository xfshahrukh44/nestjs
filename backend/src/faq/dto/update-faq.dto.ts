import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateFaqDto } from './create-faq.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
    @IsNotEmpty()
    @ApiProperty({ example: 'Is this an example question?' })
    question: string;

    @ApiProperty({ example: 'Is this an example question?' })
    question_ar: string;

    @ApiProperty({ example: 'This is an example answer' })
    answer: string;

    @ApiProperty({ example: 'This is an example answer' })
    answer_ar: string;
}
