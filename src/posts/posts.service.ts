import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  async getPosts() {
    return await this.postRepository.find();
  }

  async create(authorId: number, title: string, content: string) {
    const post = this.postRepository.create({
      title,
      content,
      author: {
        id: authorId,
      },
    });

    return await this.postRepository.save(post);
  }
}
