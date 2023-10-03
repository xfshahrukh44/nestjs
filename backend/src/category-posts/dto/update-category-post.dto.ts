import { PartialType } from '@nestjs/swagger';
import { CreateCategoryPostDto } from './create-category-post.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateCategoryPostDto extends PartialType(CreateCategoryPostDto) {
    @IsNotEmpty()
    category_id: string;

    @IsNotEmpty()
    post_id: string;
}
