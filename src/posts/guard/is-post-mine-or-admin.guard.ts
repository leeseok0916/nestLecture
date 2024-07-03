import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from '../posts.service';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/users/const/roles.conts';

@Injectable()
export class IsPostMineOrAdminGuard implements CanActivate {
  constructor(
    private readonly postsService: PostsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException('로그인이 필요합니다.');

    if (user.role === RolesEnum.ADMIN) return true;

    const postId = request.params.id;
    if (!postId) throw new UnauthorizedException('게시글 ID가 필요합니다.');

    await this.postsService.isMinePost(parseInt(postId), user.id);

    return true;
  }
}
