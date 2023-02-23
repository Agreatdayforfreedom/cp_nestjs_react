import { SetMetadata, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Field,
  Int,
  Mutation,
  ObjectType,
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
import { SkipAuth } from '../auth/decorators/skipAuth.decorator';
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
import { Project } from './models/project.model';
import { MemberService } from './services/member.service';

export const pubSub = new PubSub();

export enum NotificationType {
  BANNED = 'BANNED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
}

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.MEMBER)
@Bans(Ban.UNBANNED)
export class MemberResolver {
  static readonly MEMBER_SUB = 'memberSub';

  constructor(private memberService: MemberService) {}

  @Subscription((returns) => MemberModel, {
    filter: (payload, variables) => {
      return variables.projectId === payload.memberSub.project.id;
    },
    resolve: (value) => {
      return value.memberSub;
    },
  })
  @SkipAuth()
  memberSub(
    @Args('userId', { type: () => Int }) _userId: number,
    @Args('projectId', { type: () => Int }) _projectId: number,
  ) {
    return pubSub.asyncIterator(MemberResolver.MEMBER_SUB);
  }

  @Query((returns) => [MemberModel])
  @Roles(Role.ADMIN, Role.MODERATOR, Role.MEMBER)
  findMembers(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.memberService.findMembers(projectId);
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  async addMember(@Args() args: AddMemberArgs, @CurrentUser() cUser: User) {
    const memberAdded = await this.memberService.addMember(args, cUser);
    pubSub.publish(MemberResolver.MEMBER_SUB, {
      memberSub: {
        ...memberAdded,
        notificationType: NotificationType.MEMBER_ADDED,
      },
    });
    return memberAdded;
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  async banMember(@Args() args: BanMemberArgs, @CurrentUser() cUser: User) {
    const banned = await this.memberService.banMember(args, cUser);
    pubSub.publish(MemberResolver.MEMBER_SUB, {
      memberSub: {
        ...banned,
        notificationType: NotificationType.BANNED,
      },
    });
    return banned;
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  async changeMemberRole(@Args() args: ChangeRoleArgs) {
    const roleChanged = await this.memberService.changeMemberRole(args);
    pubSub.publish(MemberResolver.MEMBER_SUB, {
      memberSub: {
        ...roleChanged,
        notificationType: NotificationType.ROLE_CHANGED,
      },
    });
    return roleChanged;
  }

  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  async removeMember(
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentUser() cUser: User,
  ) {
    const removed = await this.memberService.removeMember(
      memberId,
      projectId,
      cUser,
    );
    pubSub.publish(MemberResolver.MEMBER_SUB, {
      memberSub: {
        ...removed,
        notificationType: NotificationType.MEMBER_REMOVED,
      },
    });
    return removed;
  }
}
