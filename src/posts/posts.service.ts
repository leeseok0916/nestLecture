import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
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
    return await this.postRepository.find({
      relations: {
        author: true,
        images: true,
      },
    });
  }

  async getPost(id: number) {
    const result = await this.postRepository.find({
      where: {
        id,
      },
      relations: {
        author: true,
        images: true,
      },
    });

    return result[0];
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PostModel>(PostModel)
      : this.postRepository;
  }

  async create(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
    const respository = this.getRepository(qr);

    const post = respository.create({
      title: postDto.title,
      content: postDto.content,
      author: {
        id: authorId,
      },
    });

    return await respository.save(post);
  }
}
