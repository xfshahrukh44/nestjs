import {IsEmail, IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'asd441@mailinator.com' })
    email: string;
}
