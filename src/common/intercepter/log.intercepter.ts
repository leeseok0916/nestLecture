import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class LogIntercepter implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 요청이 들어올 때 타임스탬프를 찍는다
     * 응답이 나갈 때 타임스탬프를 찍는다
     */
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;

    const now = new Date();
    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    // return next.handle() 을 실행하는 순간 라우트의 로직이 전부 실행되고 응답 observable로 반환된다.
    return next.handle().pipe(
      // 모니터링을 위한 tap 연산자
      tap((observable) =>
        console.log(
          `[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
        ),
      ),
      // map((observable) => {
      //   // 응답 값을 변경할 수 있다. 원하는 포맷으로 만들어서 반환할 수 있다.
      //   return {
      //     message: '응답이 완료되었습니다.',
      //     response: observable,
      //   };
      // }),
    );
  }
}
