import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserCreateArgs } from '../dtos/user.dto';
import { Issue } from '../../project/entities/issue.entity';

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

  async find(args: any) {
    return await this.userRepository.findOneBy({ username: args.username });
  }
}
