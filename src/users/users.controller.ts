import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from './decorator/roles.decorator';
import { RolesEnum } from './const/roles.conts';

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
  @Roles(RolesEnum.ADMIN)
  async getUsers() {
    return await this.usersService.getUsers();
  }
}
