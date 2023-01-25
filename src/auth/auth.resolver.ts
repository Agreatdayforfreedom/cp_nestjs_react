import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserCreateArgs, UserLoginArgs } from '../users/dtos/user.dto';
import { User as UserModel } from '../users/models/user.model';
import { CurrentUser } from './decorators/user.decorator';
import { GqlAuthGuard } from './guards/jwt-auth.guard';
import { Auth } from './models/auth.model';
import { AuthService } from './services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query((returns) => UserModel)
  @UseGuards(GqlAuthGuard)
  profile(@CurrentUser() user: UserModel) {
    console.log(user, 'uuuuuu');
    return user;
  }

  @Mutation((returns) => Auth)
  signup(@Args() args: UserCreateArgs) {
    return this.authService.signup(args);
  }

  @Mutation((returns) => Auth)
  login(@Args() args: UserLoginArgs) {
    return this.authService.login(args);
  }
}
