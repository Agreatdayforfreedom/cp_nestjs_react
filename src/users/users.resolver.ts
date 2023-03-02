import { Args, Field, Int, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { User as UserModel } from './models/user.model';
import { UsersService } from './services/users.service';

@ObjectType()
class UserModelCount {
  @Field((type) => [UserModel])
  users: UserModel;

  @Field(() => Int)
  count: number;
}

@Resolver()
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Query((returns) => [UserModel])
  findUsers() {
    return this.userService.findAll();
  }

  @Query((returns) => UserModelCount)
  async searchUsers(
    @Args('searchValue', { nullable: true }) searchValue: string,
  ) {
    const users = await this.userService.searchUsers(searchValue);
    return {
      users: users[0],
      count: users[1],
    };
  }
}
