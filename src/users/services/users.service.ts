import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserCreateArgs } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async create(args: UserCreateArgs) {
    const user = this.userRepository.create(args);
    return await this.userRepository.save(user);
  }

  async searchUsers(searchValue: string = '') {
    const users = await this.userRepository
      .createQueryBuilder('users')
      .where('users.username like :name', { name: `%${searchValue}%` })
      .getManyAndCount();
    return users;
  }

  async find(args: any) {
    return await this.userRepository.findOneBy({ username: args.username });
  }
}
