import { PickType } from '@nestjs/mapped-types';
import { CommentModel } from '../entity/comment.entity';

export class CreateCommentDto extends PickType(CommentModel, ['comment']) {}
