import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMessageDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'asdkajsdklada' })
    group_id: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'asdkajsdklada' })
    user_id: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'Hello!' })
    message: string;

    created_at: string;
}
