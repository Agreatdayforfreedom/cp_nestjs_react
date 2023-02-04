import { SetMetadata, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { clearConfigCache } from 'prettier';
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

export const pubSub = new PubSub();

const SkipAuth = () => SetMetadata('SkipAuth', true);

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.MEMBER)
@Bans(Ban.NO_BAN)
export class MemberResolver {
  constructor(private memberService: MemberService) {}

  // @Subscription((returns) => MemberModel, {
  //   filter: (payload, variables) => {
  //     return true;
  //   },
  //   resolve: (value) => {
  //     return value.banned;
  //   },
  // })
  // @SkipAuth()
  // banned() {
  //   return pubSub.asyncIterator('banned');
  // }

  // @Subscription((returns) => MemberModel, {
  //   resolve: (value) => {
  //     console.log({ value }, 'eeee');
  //     return value.roleChanged;
  //   },
  // })
  // @SkipAuth()
  // roleChanged() {
  //   return pubSub.asyncIterator('roleChanged');
  // }

  @Subscription((returns) => MemberModel, {
    resolve: (value) => {
      console.log(value);
      return value.memberSubs;
    },
  })
  @SkipAuth()
  memberSubs() {
    return pubSub.asyncIterator('memberSubs');
  }

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
  async banMember(@Args() args: BanMemberArgs, @CurrentUser() cUser: User) {
    const banned = await this.memberService.banMember(args, cUser);
    pubSub.publish('memberSubs', { memberSubs: banned });
    return banned;
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  async changeMemberRole(@Args() args: ChangeRoleArgs) {
    const roleChanged = await this.memberService.changeMemberRole(args);
    pubSub.publish('memberSubs', { memberSubs: roleChanged });
    return roleChanged;
  }

  @Mutation((returns) => String)
  @Roles(Role.ADMIN)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  removeMember(
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentUser() cUser: User,
  ) {
    return this.memberService.removeMember(memberId, projectId, cUser);
  }
}
