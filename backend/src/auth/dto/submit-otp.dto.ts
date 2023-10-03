import {IsEmail, IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class SubmitOTPDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'asd441@mailinator.com' })
    email: string;
    
    @IsNotEmpty()
    @ApiProperty({ example: 'ABCDEFG' })
    otp: string;
}
