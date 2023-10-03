import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateContactDto {
    @ApiProperty({ example: 'Name' })
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'asd441@mailinator.com' })
    email: string;

    @ApiProperty({ example: '1234567890' })
    phone: string;

    @ApiProperty({ example: 'ABC Company' })
    company: string;

    @ApiProperty({ example: 'This is sample message' })
    message: string;

    created_at: string;
}
