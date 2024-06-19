import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
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
