import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async create(user: Pick<UserModel, 'email' | 'name' | 'password'>) {
    const nameExists = await this.userRepository.exists({
      where: {
        name: user.name,
      },
    });

    if (nameExists) {
      throw new BadRequestException('이미 존재하는 이름입니다');
    }

    const emailExists = await this.userRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다');
    }

    const createdUser = this.userRepository.create({
      email: user.email,
      name: user.name,
      password: user.password,
    });

    return await this.userRepository.save(createdUser);
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
