import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageType } from 'src/entities/image.entity';
import { ImagesService } from './image/images.service';
import { DataSource, QueryRunner } from 'typeorm';
import { LogIntercepter } from 'src/common/intercepter/log.intercepter';
import { TransactionInterceptor } from 'src/common/intercepter/transaction.intercepter';
import { CustomQueryRunner } from 'src/common/decorator/query-runner.decorator';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const/roles.conts';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly imagesService: ImagesService,
    private readonly dataSource: DataSource,
  ) {}

  // DTO - Data Transfer Object
  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createPost(
    @User('id') userid: number,
    @Body() body: CreatePostDto,
    // @Request() req: any,
    @CustomQueryRunner() qr: QueryRunner,
  ) {
    const authorId = userid;

    const post = await this.postsService.create(authorId, body, qr);

    // throw new InternalServerErrorException('test');

    await this.imagesService.createPostImage(
      {
        order: 0,
        type: ImageType.POST,
        path: 'image.jpg',
        post,
      },
      qr,
    );

    return await this.postsService.getPost(post.id, qr);
  }

  @Get()
  @UseInterceptors(LogIntercepter)
  @UseFilters(HttpExceptionFilter)
  @IsPublic()
  async findAll() {
    // throw new BadRequestException('test');
    return await this.postsService.getPosts();
  }

  @Get(':id')
  @UseInterceptors(LogIntercepter)
  @IsPublic()
  async findPost(@Param('id', ParseIntPipe) id: number) {
    const result = await this.postsService.getPost(id);
    return result;
  }

  @Patch(':id')
  @UseGuards(IsPostMineOrAdminGuard)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    console.log(body);
    return 1;
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return true;
  }
}
