import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    @ApiProperty({ example: 1 })
    group_id: string;

    @ApiProperty({ example: 1 })
    user_id: string;

    @ApiProperty({ example: 'Hello!' })
    message: string;

    blocked_at: string;
}
