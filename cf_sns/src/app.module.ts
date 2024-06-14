import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entity';

@Module({
  imports: [
    PostsModule,
    // typeorm 과 nestjs를 연결하는 연결고리를 작성하는 부분
    TypeOrmModule.forRoot({
      // 데이터베이스 종류
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [PostModel],
      synchronize: true, // nestjs에서 작성하는 typeorm 코드와 실제 데이터베이스의 스키마를 동기화, 운영에서는 false로 설정
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
