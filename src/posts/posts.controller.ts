import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token-guard';
import { UserModel } from 'src/users/entities/user.entity';
import { User } from 'src/users/decorator/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // DTO - Data Transfer Object
  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    // @User() user: UserModel,
    @User('id') userid: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const authorId = userid;
    return await this.postsService.create(authorId, title, content);
  }

  @Get()
  async findAll() {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async findPost(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.getPost(id);
  }
}
