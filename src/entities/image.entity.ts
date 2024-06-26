import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PostModel } from 'src/posts/entities/post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseMode } from './base.entity';

export enum ImageType {
  POST = 'post',
}

@Entity({ name: 'images' })
export class ImageModel extends BaseMode {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  @IsEnum(ImageType)
  @IsString()
  type: ImageType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageType.POST) {
      return `/images/posts/${value}`;
    }
    return value;
  })
  path: string;

  @ManyToOne(() => PostModel, (post) => post.images)
  post?: PostModel;
}
