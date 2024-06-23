import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { UserModel } from './users/entities/user.entity';
import { PostModel } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  ENV_DB_HOST_KEY,
  ENV_DB_NAME_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USER_KEY,
} from './auth/const/env-keys.const';
import { ImageModel } from './entities/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // .env 파일을 로드, 로컬 환경에서 사용 가능
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: Number(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USER_KEY],
      // username: process.env.DB_USER,
      password: process.env[ENV_DB_PASSWORD_KEY],
      // password: process.env.DB_PASSWORD,
      database: process.env[ENV_DB_NAME_KEY],
      entities: [UserModel, PostModel, ImageModel],
      synchronize: true,
    }),
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
