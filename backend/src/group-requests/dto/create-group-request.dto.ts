import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateGroupRequestDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'asdsadad213123' })
    user_id: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'asdsadad213123' })
    group_id: string;

    created_at: string;
}
