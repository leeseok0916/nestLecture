import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentModel } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { PostModel } from '../entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
// import { PaginateCommentDto } from './dto/paginate-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
  ) {}

  async getComments(postId: number) {
    const comments = await this.commentRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
    });

    return comments;
  }

  async getComment(postId: number, commentId: number) {
    const comment = await this.commentRepository.find({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return comment;
  }

  async createComment(userId: number, postId: number, dto: CreateCommentDto) {
    const comment = this.commentRepository.create({
      comment: dto.comment,
      author: {
        id: userId,
      },
      post: {
        id: postId,
      },
    });

    return await this.commentRepository.save(comment);
  }

  async updateComment(commentId: number, body: UpdateCommentDto) {
    const prevComment = await this.commentRepository.preload({
      id: commentId,
      ...body,
    });

    return await this.commentRepository.save(prevComment);
  }

  async deleteComment(commentId: number) {
    const comment = await this.commentRepository.find({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    await this.commentRepository.delete({
      id: commentId,
    });

    return commentId;
  }
}
