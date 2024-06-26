import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostModel } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesService } from './image/images.service';
import { ImageModel } from 'src/entities/image.entity';

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
