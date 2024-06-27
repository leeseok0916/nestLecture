import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/users/decorator/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
// import { PaginateCommentDto } from './dto/paginate-comment.dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
    // @Query() query: PaginateCommentDto,
  ) {
    return await this.commentsService.getComments(postId);
  }

  @Get(':commentId')
  async getComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('postId') postId: number,
  ) {
    return await this.commentsService.getComment(postId, commentId);
  }

  @Post()
  async createComment(
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentDto,
  ) {
    return await this.commentsService.createComment(userId, postId, body);
  }

  @Put(':commentId')
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return await this.commentsService.updateComment(commentId, body);
  }

  @Delete(':commentId')
  async deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return await this.commentsService.deleteComment(commentId);
  }
}
