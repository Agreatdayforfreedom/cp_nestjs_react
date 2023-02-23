import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
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
import { SkipAuth } from '../auth/decorators/skipAuth.decorator';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
export class RequestProjectResolver {
  static readonly REQUEST_SUB = 'requestSub';
  // static readonly STATUS_REQUEST_SUB = 'statusRequestSub';

  constructor(private requestProjectService: RequestProjectService) {}

  @Subscription((returns) => RequestProject, {
    filter(this: RequestProjectResolver, payload, variables) {
      // console.log(payload.requestSub.notificationType);
      // console.log(payload.requestSub.project, variables);
      if (
        payload.requestSub.notificationType === this.acceptOrRejectRequest.name
      ) {
        return payload.requestSub.user.id === variables.userId;
      }
      if (payload.requestSub.notificationType === this.requestProject.name) {
        return payload.requestSub.project.id === variables.projectId;
      }
    },
    resolve: (value) => {
      return value.requestSub;
    },
  })
  @SkipAuth()
  requestSub(
    @Args('userId', { type: () => Int }) _userId: number,
    @Args('projectId', { type: () => Int, nullable: true }) _projectId?: number,
  ) {
    return pubSub.asyncIterator(RequestProjectResolver.REQUEST_SUB);
  }

  // @Subscription((returns) => RequestProject, {
  //   filter: (payload, variables) => {
  //     console.log(payload, variables);
  //     return true;
  //   },
  //   resolve: (value) => {
  //     console.log(value);
  //     return value.statusRequestSub;
  //   },
  // })
  // @SkipAuth()
  // statusRequestSub() {
  //   console.log('executed?2');

  //   return pubSub.asyncIterator(RequestProjectResolver.STATUS_REQUEST_SUB);
  // }

  @Query((returns) => RequestProject)
  @Roles(Role.PROFILE)
  @Bans(Ban.PROFILE)
  alreadyRequested(
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentUser() cUser: User,
  ) {
    return this.requestProjectService.alreadyRequested(projectId, cUser);
  }

  @Query((returns) => [RequestProject])
  @Roles(Role.ADMIN)
  @Bans(Ban.BANNED, Ban.PARTIAL_BAN)
  findRequests(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.requestProjectService.findRequests(projectId);
  }

  @Mutation((returns) => RequestProject)
  @Roles(Role.PROFILE)
  @Bans(Ban.PROFILE)
  async requestProject(
    @Args('projectId', { type: () => Int }) projectId: number,
    @CurrentUser() cUser: User,
  ) {
    const request = await this.requestProjectService.requestProject(
      projectId,
      cUser,
    );
    pubSub.publish(RequestProjectResolver.REQUEST_SUB, {
      requestSub: { ...request, notificationType: this.requestProject.name },
    });
    return request;
  }

  @Mutation((returns) => RequestProject)
  @Roles(Role.ADMIN)
  @Bans(Ban.BANNED, Ban.PARTIAL_BAN)
  async acceptOrRejectRequest(
    @Args('requestId', { type: () => Int }) requestId: number,
    @Args('status', { type: () => RequestStatus })
    status: Exclude<RequestStatus, RequestStatus.PENDING>,
    @CurrentUser() cUser: UserEntity,
  ) {
    const reqStatus = await this.requestProjectService.acceptOrRejectRequest(
      requestId,
      status,
      cUser,
    );
    pubSub.publish(RequestProjectResolver.REQUEST_SUB, {
      requestSub: {
        ...reqStatus,
        notificationType: this.acceptOrRejectRequest.name,
      },
    });
    return reqStatus;
  }
}
