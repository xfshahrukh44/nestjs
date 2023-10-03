import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AcceptGroupRequestDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'asdasdasdsa' })
    id: string;
}
