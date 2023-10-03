import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateMediaDto } from './create-media.dto';
import {IsUrl} from "class-validator";

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
    @ApiProperty({ example: 'user' })
    module: string;

    @ApiProperty({ example: 1 })
    module_id: number;

    @ApiProperty({ example: 'profile-picture' })
    sub_module: string;

    @IsUrl()
    @ApiProperty({ example: 'https://www.google.com/123.jpg' })
    url: string;
}
