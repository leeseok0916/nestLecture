import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
  constructor(private readonly postService: PostsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const postId = parseInt(req.params.postId);

    if (!postId) {
      throw new BadRequestException('postId가 올바르지 않습니다.');
    }

    await this.postService.checkPostExistsById(postId);

    next();
  }
}
