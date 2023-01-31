import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AddMemberArgs } from './dtos/project.dto';
import { Ban, Role } from './entities/member.entity';
import { Member as MemberModel } from './models/member.model';
import { MemberService } from './services/member.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class MemberResolver {
  constructor(private memberService: MemberService) {}

  @Query((returns) => [MemberModel])
  findMembers(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.memberService.findMembers(projectId);
  }

  @Query((returns) => MemberModel)
  findAuthMember(
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentUser() cUser: User,
  ) {
    return this.memberService.findAuthMember(projectId, cUser);
  }

  @Mutation((returns) => MemberModel)
  addMember(@Args() args: AddMemberArgs, @CurrentUser() cUser: User) {
    return this.memberService.addMember(args, cUser);
  }

  @Mutation((returns) => MemberModel)
  banMember(
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('banType') banType: Ban,
    @CurrentUser() cUser: User,
  ) {
    console.log(memberId, banType, cUser);
    return this.memberService.banMember(memberId, banType, cUser);
  }

  @Mutation((returns) => String)
  removeMember(
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentUser() cUser: User,
  ) {
    return this.memberService.removeMember(memberId, projectId);
  }
}
