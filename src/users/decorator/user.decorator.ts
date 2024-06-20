import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { UserModel } from '../entities/user.entity';

/**
 * Custom decorator to get the user object from the request object
 * accessTokenGuard가 필수 사용되는 경우에 사용해야 하는 데코레이터이다.
 */
export const User = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserModel;

    if (!user) {
      throw new InternalServerErrorException(
        'User 데코레이터는 AccessTokenGuard가 필수 사용되는 경우에 사용해야 합니다.',
      );
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
