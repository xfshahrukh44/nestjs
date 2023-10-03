import {IsNotEmpty} from "class-validator";

export class GetCategoryTranslationDto {
    @IsNotEmpty()
    module_id: number;

    @IsNotEmpty()
    language_id: number;

    @IsNotEmpty()
    key: string;
}
