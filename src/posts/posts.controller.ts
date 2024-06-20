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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    @Request() req: any,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const authorId = req['user'].id;
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
