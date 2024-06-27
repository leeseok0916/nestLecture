import { IsNumber, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { BaseMode } from 'src/entities/base.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'comments' })
export class CommentModel extends BaseMode {
  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(1, 100, { message: lengthValidationMessage })
  comment: string;

  @Column({ default: 0 })
  @IsNumber()
  likeCount: number;

  @ManyToOne(() => UserModel, (user) => user.comments)
  author: UserModel;

  @ManyToOne(() => PostModel, (post) => post.comments)
  post: PostModel;
}
