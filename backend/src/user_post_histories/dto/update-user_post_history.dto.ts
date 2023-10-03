import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateUserPostHistoryDto } from './create-user_post_history.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateUserPostHistoryDto extends PartialType(CreateUserPostHistoryDto) {
    @ApiProperty({ example: 'asdsarasdsa' })
    user_id: string;

    @ApiProperty({ example: 'asdsarasdsa' })
    post_id: string;

    created_at: string;
}
