import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import {IsNotEmpty} from "class-validator";

export class AddUserDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'asdankdqah' })
    user_id: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'asdankdqah' })
    group_id: string;
}
