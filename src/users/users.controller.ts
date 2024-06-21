import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // async create(
  //   @Body('email') email: string,
  //   @Body('name') name: string,
  //   @Body('password') password: string,
  // ) {
  //   return await this.usersService.create({ email, name, password });
  // }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.usersService.getUsers();
  }
}
