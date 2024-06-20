import { BaseMode } from 'src/entities/base.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UserModel extends BaseMode {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
