import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Roles annotation 에 대한 metadata 를 가져온다
     * reflector
     *  getAllAndOverride()
     *  - 컨트롤러와 메서드에 Roles 데코레이터가 등록되어 있다고 가정하면 메서드에 등록되어 있는 어노테이션을 가져온다.
     */
    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Roles 어노테이션이 없다면 통과  -> Roles 어노테이션이 없다면 권한이 필요하지 않은 요청이다.
    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    const role = user.role;

    if (!role) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    if (role !== requiredRole) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
