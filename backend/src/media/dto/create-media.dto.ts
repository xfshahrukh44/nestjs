import {IsNotEmpty, IsUrl} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMediaDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'user' })
    module: string;

    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    module_id: number;

    @ApiProperty({ example: 'profile-picture' })
    sub_module: string;

    @IsNotEmpty()
    @IsUrl()
    @ApiProperty({ example: 'https://www.google.com/123.jpg' })
    url: string;

    created_at: string;
}
