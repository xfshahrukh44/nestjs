import {IsEmail, IsNotEmpty, MaxLength} from 'class-validator';

export class SignupDto {
    @IsNotEmpty()
    @MaxLength(20)
    first_name: string;

    @IsNotEmpty()
    @MaxLength(20)
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    phone: string;

    @IsNotEmpty()
    password: string;
}
