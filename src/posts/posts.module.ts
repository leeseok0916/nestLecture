import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostModel } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesService } from './image/images.service';
import { ImageModel } from 'src/entities/image.entity';
import { LogMiddleware } from 'src/common/middleware/log.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel, ImageModel]),
    AuthModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, ImagesService],
})
export class PostsModule {}
// export class PostsModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // consumer.apply(LogMiddleware).forRoutes(PostsController);
//     consumer.apply(LogMiddleware).forRoutes({
//       path: 'posts*',
//       method: RequestMethod.ALL,
//     });
//   }
// }
