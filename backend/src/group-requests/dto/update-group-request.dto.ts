import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateGroupRequestDto } from './create-group-request.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateGroupRequestDto extends PartialType(CreateGroupRequestDto) {
    @ApiProperty({ example: 1 })
    user_id: string;

    @ApiProperty({ example: 1 })
    group_id: string;

    created_at: string;
}
