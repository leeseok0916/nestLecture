import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

// HttpException 에 해당하는 모든 에러를 잡을 수 있다 => 즉, nestjs에서 기본 제공하는 Exception을 모두 잡을 수 있다.
// 커스텀 Exception를 만들어서 사용하면 잡지 못함
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // 로그 파일을 생성하거나, 로그 모니터링 시스템에 api 호출하기
    console.log(
      `[RES] ${request.originalUrl} ${new Date().toLocaleString('kr')} ${exception.message}`,
    ),
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toLocaleString('kr'),
        path: request.url,
      });
  }
}
