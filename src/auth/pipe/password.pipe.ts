import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export class PasswordPipe implements PipeTransform {
  /**
   * 강제하는 메서드 구현
   *
   * @param value - 파이프로 들어온 값
   * @param metadata
   * @param metadata.Paramtype - body, query, param 으로 들어온 것인지 구분 값
   * @param metadata.metatype - 컨트롤러 메서드에서 정의한 타입, 예) findPost(@Param('id', ParseIntPipe) id: number)
   * @param metadata.data - 요청이 온 실제 속성명(키), 예) @Body('userId')` would yield `userId`
   */
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().lenght < 7) {
      throw new BadRequestException('비밀번호는 8자리 이상이어야 합니다.');
    }
    return value;
  }
}

export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly maxLength: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.maxLength) {
      throw new BadRequestException(
        `${this.maxLength}자 이상은 입력할 수 없습니다.`,
      );
    }
    return value;
  }
}

export class MinLengthPipe implements PipeTransform {
  constructor(private readonly minLength: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < this.minLength) {
      throw new BadRequestException(
        `${this.minLength}자 이하로 입력할 수 없습니다.`,
      );
    }
    return value;
  }
}
