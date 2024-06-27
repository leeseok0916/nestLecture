import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // isPublic 데코레이터가 붙어있는 경우에는 토큰 검증을 하지 않는다.
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();

    if (isPublic) {
      request['isRoutePublic'] = true;
      return true;
    }

    const rawToken = request.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰 없다 마');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const verifyToken = this.authService.verifyToken(token);
    const user = await this.userService.getUserByEmail(verifyToken.email);

    request['token'] = token;
    request['tokenType'] = verifyToken.type;
    request['user'] = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<Request>();

    if (request['isRoutePublic']) {
      return true;
    }

    const tokenType = request['tokenType'];

    if (tokenType !== 'access') {
      throw new UnauthorizedException('액세스 토큰이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<Request>();

    if (request['isRoutePublic']) {
      return true;
    }

    const tokenType = request['tokenType'];

    if (tokenType !== 'refresh') {
      throw new UnauthorizedException('리프레쉬 토큰이 아닙니다.');
    }

    return true;
  }
}
