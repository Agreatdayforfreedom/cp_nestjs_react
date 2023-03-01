import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Bans } from '../auth/decorators/ban.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { BanGuard } from '../auth/guards/ban.guard';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Ban, Role } from '../interfaces/enums';
import { CreateLabelDto } from './dtos/label.dto';
import { Label } from './models/label.model';
import { LabelService } from './services/label.service';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.ADMIN, Role.MEMBER, Role.MODERATOR)
@Bans(Ban.UNBANNED)
export class LabelResolver {
  constructor(private labelService: LabelService) {}

  @Query((returns) => [Label])
  getLabels(@Args('issueId', { type: () => Int }) issueId: number) {
    return this.labelService.getLabels(issueId);
  }

  @Mutation((returns) => Label)
  @Bans(Ban.BANNED, Ban.PARTIAL_BAN)
  async newLabel(@Args() args: CreateLabelDto) {
    const newLabel = await this.labelService.newLabel(args);

    console.log({ newLabel });
    let data: string = `Label ${newLabel.labelName} was added to the :${newLabel.issue.title}: issue.`;

    return newLabel;
  }

  @Mutation((returns) => Label)
  @Bans(Ban.BANNED, Ban.PARTIAL_BAN)
  quitLabel(@Args('labelId', { type: () => Int }) labelId: number) {
    return this.labelService.quitLabel(labelId);
  }
}
