import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
    @IsNotEmpty()
    @ApiProperty({ example: 'Group Name' })
    name: string;

    last_message: string;

    last_updated: string;

    members : string;
}
