import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { User as UserEntity } from '../users/entities/user.entity';
import { RequestStatus } from './entities/requestProject.entity';
import { RequestProject } from './models/requestProject.model';
import { RequestProjectService } from './services/request-project.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { BanGuard } from '../auth/guards/ban.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Ban, Role } from './entities/member.entity';
import { Bans } from '../auth/decorators/ban.decorator';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.ADMIN)
@Bans(Ban.BANNED, Ban.PARTIAL_BAN)
export class RequestProjectResolver {
  constructor(private requestProjectService: RequestProjectService) {}

  @Query((returns) => [RequestProject])
  findRequests(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.requestProjectService.findRequests(projectId);
  }

  @Mutation((returns) => RequestProject)
  requestProject(
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentUser() cUser: User,
  ) {
    return this.requestProjectService.requestProject(projectId, cUser);
  }

  @Mutation((returns) => RequestProject)
  acceptOrRejectRequest(
    @Args('requestId', { type: () => Int }) requestId: number,
    @Args('status', { type: () => RequestStatus })
    status: Exclude<RequestStatus, RequestStatus.PENDING>,
    @CurrentUser() cUser: UserEntity,
  ) {
    return this.requestProjectService.acceptOrRejectRequest(
      requestId,
      status,
      cUser,
    );
  }
}
