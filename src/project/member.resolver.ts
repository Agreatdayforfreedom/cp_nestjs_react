import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Bans } from '../auth/decorators/ban.decorator';
import { CurrentMember } from '../auth/decorators/member.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { BanGuard } from '../auth/guards/ban.guard';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { User } from '../users/entities/user.entity';
import {
  AddMemberArgs,
  BanMemberArgs,
  ChangeRoleArgs,
} from './dtos/member.dto';
import { Ban, Role } from './entities/member.entity';
import { Member as MemberModel } from './models/member.model';
import { MemberService } from './services/member.service';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.MEMBER)
@Bans(Ban.NO_BAN)
export class MemberResolver {
  constructor(private memberService: MemberService) {}

  @Query((returns) => [MemberModel])
  @Roles(Role.ADMIN, Role.MODERATOR, Role.MEMBER)
  findMembers(
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentMember() cMember: MemberModel,
  ) {
    return this.memberService.findMembers(projectId);
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  addMember(@Args() args: AddMemberArgs, @CurrentUser() cUser: User) {
    return this.memberService.addMember(args, cUser);
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.MEMBER)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  banMember(@Args() args: BanMemberArgs, @CurrentUser() cUser: User) {
    return this.memberService.banMember(args, cUser);
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  changeMemberRole(@Args() args: ChangeRoleArgs) {
    return this.memberService.changeMemberRole(args);
  }

  @Mutation((returns) => String)
  @Roles(Role.ADMIN)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  removeMember(
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('projectId', { type: () => Int }) projectId: number,
  ) {
    return this.memberService.removeMember(memberId, projectId);
  }
}
