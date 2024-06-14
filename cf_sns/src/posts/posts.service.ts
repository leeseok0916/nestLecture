import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    // 어떤 모델의 레포지토리를 주입할 것인지 정의
    // 레포지토리는 Ioc 컨테이너에 자동으로 인스턴스가 생성되지 않기 때문에 @InjectRepository 데코레이터를 사용하면 인스턴스를 생성해주는 것 같다.
    // typeorm에 postModel을 주입해줄거야라고 알려주는 것
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return await this.postRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  async createPost(author: string, title: string, content: string) {
    // 데이터를 생성하는 법
    // create() 로 객체를 생성하고 save() 로 저장한다.
    // create() 함수로 스키마 유효성 체크 기능이 있음
    // save() 함수는 저장 기능
    const post = this.postRepository.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postRepository.save(post);
    // const newPost2 = await this.postRepository.save({
    //   author,
    //   title,
    //   content,
    //   likeCount: 0,
    //   commentCount: 0,
    // });
    return newPost;
  }

  async updatePost(id: number, author: string, title: string, content: string) {
    // save의 기능
    // 1. 데이터가 존재하지 않으면 새로 생성
    // 2. 데이터가 존재하면 업데이트

    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    const updatedPost = await this.postRepository.save(post);
    return updatedPost;
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // await this.postRepository.remove(post);
    await this.postRepository.delete(id);
    return id;
  }
}
