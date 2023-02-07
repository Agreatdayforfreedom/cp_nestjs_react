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

@ObjectType()
class MemberSubscription extends MemberModel {
  @Field()
  notificationType: string;
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
      console.log({ payload, variables });
      return variables.projectId === payload.memberSub.project.id;
    },
    resolve: (value) => {
      return value.memberSub;
    },
  })
  @SkipAuth()
  memberSub(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('projectId', { type: () => Int }) projectId: number,
  ) {
    return pubSub.asyncIterator(MemberResolver.MEMBER_SUB);
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
    pubSub.publish(MemberResolver.MEMBER_SUB, {
      memberSub: {
        ...banned,
        notificationType: 'banned',
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
        notificationType: 'roleChanged',
      },
    });
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
