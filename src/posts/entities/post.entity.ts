import { BaseMode } from 'src/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({
  name: 'posts',
})
export class PostModel extends BaseMode {
  @Column({
    nullable: false,
  })
  title: string;

  @Column()
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
}
