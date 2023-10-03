import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import {IsEmail} from "class-validator";

export class UpdateContactDto extends PartialType(CreateContactDto) {
    @ApiProperty({ example: 'Name' })
    name: string;

    @IsEmail()
    @ApiProperty({ example: 'asd441@mailinator.com' })
    email: string;

    @ApiProperty({ example: '1234567890' })
    phone: string;

    @ApiProperty({ example: 'ABC Company' })
    company: string;

    @ApiProperty({ example: 'This is sample message' })
    message: string;
}
