import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GqlContextType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Role } from '../project/entities/member.entity';
import { Member as MemberModel } from '../project/models/member.model';
import {
  RefreshTokenArgs,
  UserCreateArgs,
  UserLoginArgs,
} from '../users/dtos/user.dto';
import { Profile, User as UserModel } from '../users/models/user.model';
import { CurrentMember } from './decorators/member.decorator';
import { Roles } from './decorators/role.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { GqlAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { Auth } from './models/auth.model';
import { AuthService } from './services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query((returns) => Profile)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.PROFILE)
  profile(
    @CurrentUser() cUser: UserModel,
    @CurrentMember() cMember: MemberModel,
  ) {
    return {
      ...cUser,
      currentProjectMember: cMember,
    };
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
