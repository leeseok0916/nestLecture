import { Injectable } from '@nestjs/common';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async create(email: string, name: string, password: string) {
    const user = this.userRepository.create({
      email,
      name,
      password,
    });

    return await this.userRepository.save(user);
  }

  async getUsers() {
    return await this.userRepository.find();
  }
}
