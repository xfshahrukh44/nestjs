import {IsNotEmpty} from "class-validator";

export class GetPostTranslationDto {
    @IsNotEmpty()
    module_id: number;

    @IsNotEmpty()
    language_id: number;

    @IsNotEmpty()
    key: string;
}
