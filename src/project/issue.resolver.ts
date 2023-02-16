import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BanGuard } from '../auth/guards/ban.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { User } from '../users/models/user.model';
import { CreateIssueArgs, UpdateIssueArgs } from './dtos/issue.dto';
import { Issue } from './models/issue.model';
import { IssueService } from './services/issue.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Ban, Role } from './entities/member.entity';
import { Bans } from '../auth/decorators/ban.decorator';
import { CurrentMember } from '../auth/decorators/member.decorator';
import { Member } from './models/member.model';
import { Label } from './models/label.model';
import { LabelService } from './services/label.service';

@Resolver((of) => Issue)
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.ADMIN, Role.MEMBER, Role.MODERATOR)
@Bans(Ban.BANNED)
export class IssueResolver {
  constructor(
    private issueService: IssueService,
    private labelService: LabelService,
  ) {}

  @Query((returns) => [Issue])
  findIssues(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.issueService.findIssues(projectId);
  }

  @Query((returns) => Issue)
  findIssue(@Args('issueId', { type: () => Int }) issueId: number) {
    return this.issueService.findIssue(issueId);
  }

  @Mutation((returns) => Issue)
  newIssue(@Args() args: CreateIssueArgs, @CurrentUser() cUser: User) {
    return this.issueService.newIssue(args, cUser);
  }

  @Mutation((returns) => Issue)
  addLabels(
    @Args('issueId', { type: () => Int }) issueId: number,
    @Args('labels', { type: () => [Int] }) labels: number[],
  ) {
    return this.issueService.addLabels(issueId, labels);
  }

  @Mutation((returns) => Issue)
  updateIssue(@Args() args: UpdateIssueArgs, @CurrentMember() cMember: Member) {
    return this.issueService.updateIssue(args, cMember);
  }

  @Mutation((returns) => Issue)
  closeIssue(@Args('issueId', { type: () => Int }) issueId: number) {
    return this.issueService.closeIssue(issueId);
  }

  @ResolveField('labels', (returns) => [Label])
  async labels(@Parent() issue: Issue) {
    console.log(issue);
    return this.labelService.getLabels(issue.id);
  }
}