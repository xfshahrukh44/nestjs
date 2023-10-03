import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserPostHistoryDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'asdasdsad' })
    user_id: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'asdasdsad' })
    post_id: string;

    created_at: string;
}
