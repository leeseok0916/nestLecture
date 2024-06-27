import { IsNumber, IsOptional } from 'class-validator';

export class PaginateCommentDto {
  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;
}
