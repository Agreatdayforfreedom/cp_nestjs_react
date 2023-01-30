import { Query, Resolver } from '@nestjs/graphql';
import { User as UserModel } from './models/user.model';
import { UsersService } from './services/users.service';

@Resolver()
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Query((returns) => [UserModel])
  findUsers() {
    return this.userService.findAll();
  }
}
