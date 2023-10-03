import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import {IsNotEmpty} from "class-validator";

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @ApiProperty({ example: [1, 2, 3] })
    category_ids: string[];

    @ApiProperty({ example: 'Post title' })
    title: string;

    @ApiProperty({ example: 'Post description' })
    description: string;

    @ApiProperty({ example: 'https://www.google.com' })
    url: string;

    @ApiProperty({ example: '12-12-2023' })
    date: string;

    @ApiProperty({ example: '12:00 AM' })
    time: string;

    @ApiProperty({ example: 'https://localhost/post/videos/video.mp4' })
    video: string;

    @ApiProperty({ example: 'https://localhost/post/audios/audio.wav' })
    audio: string;

    @ApiProperty({ example: 'https://localhost/post/images/image.jpg' })
    image: string;

    @ApiProperty({ example: 'https://localhost/post/pdfs/pdf.pdf' })
    pdf: string;

    @ApiProperty({ example: 1 })
    is_featured: number;

    @ApiProperty({ example: ['https://localhost/post/images/1.jpg', 'https://localhost/post/images/2.jpg'] })
    images: [];

    created_at: string;
}
