import { InjectRepository } from '@nestjs/typeorm';
import { ImageModel } from 'src/entities/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  async createPostImage(dto: CreateImageDto, qr?: QueryRunner) {
    const respository = this.getRepository(qr);
    return respository.save({
      ...dto,
    });
  }
}
