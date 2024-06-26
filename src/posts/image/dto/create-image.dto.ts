import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from 'src/entities/image.entity';

export class CreateImageDto extends PickType(ImageModel, [
  'order',
  'type',
  'path',
  'post',
]) {}
