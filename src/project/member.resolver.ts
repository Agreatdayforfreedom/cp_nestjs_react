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
import {
  Ban,
  NotificationType,
  Notification_Enum,
  Notification_Type,
  Role,
} from '../interfaces/enums';
import { User } from '../users/entities/user.entity';
import {
  AddMemberArgs,
  BanMemberArgs,
  ChangeRoleArgs,
} from './dtos/member.dto';
// import { Ban, Role } from './entities/member.entity';
import { Member as MemberModel } from './models/member.model';
import { NotificationResolver } from './notification.resolver';
import { MemberService } from './services/member.service';

export const pubSub = new PubSub();

// this is an adopted child by the enum family

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.MEMBER)
@Bans(Ban.UNBANNED)
export class MemberResolver {
  static readonly MEMBER_SUB = 'memberSub';

  constructor(
    private memberService: MemberService,
    private notificationResolver: NotificationResolver,
  ) {}

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
    //todo: noti here
    return memberAdded;
  }
  @Mutation((returns) => MemberModel)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Bans(Ban.PARTIAL_BAN, Ban.BANNED)
  async banMember(@Args() args: BanMemberArgs, @CurrentUser() cUser: User) {
    const banned = await this.memberService.banMember(args, cUser);
    let data: string;
    if (
      (banned.ban as Notification_Type) ===
      (Notification_Enum.BANNED as Notification_Type)
    ) {
      data = `you have been banned from :${banned.project.title}: project`;
    } else if (
      (banned.ban as Notification_Type) ===
      (Notification_Enum.PARTIAL_BAN as Notification_Type)
    ) {
      data = `you have been restricted with partial ban from :${banned.project.title}: project`;
    } else {
      //unbanned
      data = `you have been unbanned from :${banned.project.title}: project!`;
    }
    await this.notificationResolver.createNotification(
      data,
      banned.ban,
      banned.user.id,
    );
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
    let data: string;
    if (
      (roleChanged.role as Notification_Type) ===
      (Notification_Enum.MODERATOR as Notification_Type)
    ) {
      data = `Now you are moderator in the :${roleChanged.project.title}: project`;
    } else if (
      (roleChanged.role as Notification_Type) ===
      (Notification_Enum.ADMIN as Notification_Type)
    ) {
      data = `Now you are admin in the :${roleChanged.project.title}: project!`;
    } else {
      //member
      data = `Now you are member in the :${roleChanged.project.title}: project`;
    }

    await this.notificationResolver.createNotification(
      data,
      roleChanged.role,
      roleChanged.user.id,
    );
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
    let data = `You have been removed from :${removed.project.title}: project.`;
    await this.notificationResolver.createNotification(
      data,
      'REMOVED',
      removed.userId,
    );
    return removed;
  }
}
