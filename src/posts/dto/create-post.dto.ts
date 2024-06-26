import { PickType } from '@nestjs/mapped-types';
import { PostModel } from '../entities/post.entity';
import { IsOptional, IsString } from 'class-validator';

// 타입스크립트의 Pick, Omit, Partial -> type을 반환
// nestjs 에서 제공하는 PickType, OmitType, PartialType -> value(key)를 반환
export class CreatePostDto extends PickType(PostModel, ['title', 'content']) {
  @IsString({ each: true })
  @IsOptional()
  images: string[];
}
