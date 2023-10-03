import {IsNotEmpty} from "class-validator";

export class CreateCategoryPostDto {
    @IsNotEmpty()
    category_id: string;

    @IsNotEmpty()
    post_id: string;
}
