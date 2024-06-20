import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
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
    const tokenType = request['tokenType'];

    if (tokenType !== 'refresh') {
      throw new UnauthorizedException('리프레쉬 토큰이 아닙니다.');
    }

    return true;
  }
}
