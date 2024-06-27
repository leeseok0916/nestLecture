import { IsString, MaxLength } from 'class-validator';
import { BaseMode } from 'src/entities/base.entity';
import { ImageModel } from 'src/entities/image.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommentModel } from '../comments/entity/comment.entity';

@Entity({
  name: 'posts',
})
export class PostModel extends BaseMode {
  @Column({
    nullable: false,
  })
  @IsString({
    message: 'title 문자열이어야 합니다.',
  })
  @MaxLength(100, {
    message: 'title은 최대 100자까지 입력 가능합니다.',
  })
  title: string;

  @Column()
  @IsString({
    message: 'content 문자열이어야 합니다.',
  })
  @MaxLength(4000, {
    message: 'content는 최대 4000자까지 입력 가능합니다.',
  })
  content: string;

  @Column({
    default: 0,
  })
  likeCount: number;

  @Column({
    default: 0,
  })
  commentCount: number;

  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @OneToMany(() => ImageModel, (image) => image.post)
  images: ImageModel[];

  @OneToMany(() => CommentModel, (comment) => comment.post)
  comments: CommentModel[];
}
