import {IsEmail, IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class BlockUserDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'asdsadsadsa' })
    user_id: string;
}
