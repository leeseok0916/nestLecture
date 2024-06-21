import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  async getPosts() {
    return await this.postRepository.find();
  }

  getPost(id: number) {
    return this.postRepository.find({
      where: {
        id,
      },
    });
  }

  async create(authorId: number, postDto: CreatePostDto) {
    const post = this.postRepository.create({
      title: postDto.title,
      content: postDto.content,
      author: {
        id: authorId,
      },
    });

    return await this.postRepository.save(post);
  }
}
