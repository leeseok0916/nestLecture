import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome() {
    return '웰컴 집';
  }

  @Get('post')
  // @Get('/post') 위에꺼랑 동일
  getPost() {
    return '포스트';
  }

  @Get('user')
  getUser() {
    return '유저';
  }
}
