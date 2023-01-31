import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  RefreshTokenArgs,
  UserCreateArgs,
  UserLoginArgs,
} from '../users/dtos/user.dto';
import { Profile, User as UserModel } from '../users/models/user.model';
import { CurrentUser } from './decorators/user.decorator';
import { GqlAuthGuard } from './guards/jwt-auth.guard';
import { Auth } from './models/auth.model';
import { AuthService } from './services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query((returns) => Profile)
  @UseGuards(GqlAuthGuard)
  profile(@CurrentUser() user: UserModel) {
    console.log(user);
    return user;
  }

  @Query((returns) => Auth)
  refreshToken(@Args() args: RefreshTokenArgs) {
    return this.authService.refreshToken(args);
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
