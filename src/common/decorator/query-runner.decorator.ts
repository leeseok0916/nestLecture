import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const CustomQueryRunner = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const queryRunner = request.queryRunner;
    if (!queryRunner) {
      throw new InternalServerErrorException('QueryRunner is not found');
    }

    return queryRunner;
  },
);
