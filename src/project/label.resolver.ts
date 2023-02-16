import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Bans } from '../auth/decorators/ban.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { BanGuard } from '../auth/guards/ban.guard';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateLabelDto } from './dtos/label.dto';
import { Ban, Role } from './entities/member.entity';
import { Label } from './models/label.model';
import { LabelService } from './services/label.service';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.ADMIN, Role.MEMBER, Role.MODERATOR)
@Bans(Ban.BANNED)
export class LabelResolver {
  constructor(private labelService: LabelService) {}

  @Query((returns) => [Label])
  getLabels(@Args('issueId', { type: () => Int }) issueId: number) {
    return this.labelService.getLabels(issueId);
  }

  @Mutation((returns) => Label)
  newLabel(@Args() args: CreateLabelDto) {
    return this.labelService.newLabel(args);
  }

  @Mutation((returns) => Label)
  quitLabel(@Args('labelId', { type: () => Int }) labelId: number) {
    return this.labelService.quitLabel(labelId);
  }
}
