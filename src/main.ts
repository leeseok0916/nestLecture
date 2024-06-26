import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filter/http.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // nestjs 전체에 파이프 적용
  // 근데 어떤 파이프를 넣어줄거야? -> ValidationPipe
  // DTO의 class-validator 어노테이션을 붙여놓으면 자동으로 검증해주는 파이프
  app.useGlobalPipes(new ValidationPipe());
  
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
