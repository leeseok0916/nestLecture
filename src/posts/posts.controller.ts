import {
  Body,
  Controller,
  Get,
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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // DTO - Data Transfer Object
  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    @User('id') userid: number,
    // @Body('title') title: string,
    // @Body('content') content: string,
    @Body() body: CreatePostDto,
  ) {
    const authorId = userid;
    return await this.postsService.create(authorId, body);
  }

  @Get()
  async findAll() {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async findPost(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.getPost(id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    // @Body('title') title?: string,
    // @Body('content') content?: string,
    @Body() body: UpdatePostDto,
  ) {
    console.log(body);
    return 1;
    // return await this.postsService.updatePost(id, body);
  }
}
