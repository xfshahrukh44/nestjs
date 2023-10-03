import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateGroupDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'Group Name' })
    name: string;

    created_at: string;
}
