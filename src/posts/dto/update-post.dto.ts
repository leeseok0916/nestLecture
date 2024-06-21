import { IsOptional, IsString } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  // @IsString()
  @IsOptional()
  title?: string;

  // @IsString()
  @IsOptional()
  content?: string;
}

// 위 클래스와 차이점 -> CreatePostDto랑 UpdatePostDto에서 필수로 받아야 하는 속성이 생긴다면??
// export class UpdatePostDto {
//   @IsString()
//   @IsOptional()
//   title?: string;

//   @IsString()
//   @IsOptional()
//   content?: string;
// }
