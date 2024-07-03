import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getPost(id: number, qr?: QueryRunner) {
    const respository = this.getRepository(qr);

    const result = await respository.find({
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

  async checkPostExistsById(postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
  }

  async isMinePost(postId: number, userId: number) {
    const post = await this.postRepository.exists({
      where: {
        id: postId,
        author: {
          id: userId,
        },
      },
      relations: ['author'],
    });

    if (!post) {
      throw new ForbiddenException('자신의 게시글만 수정할 수 있습니다.');
    }
  }
}
