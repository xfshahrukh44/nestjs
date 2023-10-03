import {IsEmail, IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ResetPasswordDto {
    @IsNotEmpty()
    @ApiProperty({ example: '<your-password>' })
    password: string;
}
