import {IsEmail, IsNotEmpty, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @MaxLength(20)
    @ApiProperty({ example: 'cedric' })
    first_name: string;

    @IsNotEmpty()
    @MaxLength(20)
    @ApiProperty({ example: 'maya' })
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'asd441@mailinator.com' })
    email: string;

    @ApiProperty({ example: '123456' })
    phone: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'admin!@#' })
    password: string;

    role_id: number;

    fcm_token: string;

    blocked_users: string;

    created_at: string;
}
