import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token-guard';
import { UserModel } from 'src/users/entities/user.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageType } from 'src/entities/image.entity';
import { ImagesService } from './image/images.service';
import { DataSource } from 'typeorm';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly imagesService: ImagesService,
    private readonly dataSource: DataSource,
  ) {}

  // DTO - Data Transfer Object
  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(@User('id') userid: number, @Body() body: CreatePostDto) {
    const authorId = userid;
    /**
     * 1. 쿼리 러너 생성
     * 2. 쿼리 러너 연결
     * 3. 쿼리 러너에서 트랜잭션 시작, 쿼리 러너를 통해 쿼리 실행
     */
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const post = await this.postsService.create(authorId, body, qr);

      throw new InternalServerErrorException('test');

      await this.imagesService.createPostImage(
        {
          order: 0,
          type: ImageType.POST,
          path: 'image.jpg',
          post,
        },
        qr,
      );

      await qr.commitTransaction();
      await qr.release();

      return await this.postsService.getPost(post.id);
    } catch (error) {
      await qr.rollbackTransaction();
      await qr.release();
      throw error;
    }
  }

  @Get()
  async findAll() {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async findPost(@Param('id', ParseIntPipe) id: number) {
    const result = await this.postsService.getPost(id);
    return result;
  }

  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    console.log(body);
    return 1;
    // return await this.postsService.updatePost(id, body);
  }
}
