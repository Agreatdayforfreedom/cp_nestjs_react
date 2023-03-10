import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NotificationKind } from 'rxjs';
import { SkipAuth } from '../auth/decorators/skipAuth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/models/user.model';
import { Notification } from './models/notification.model';
import { NotificationService } from './services/notification.service';

const pubSub = new PubSub();

@Resolver()
@UseGuards(GqlAuthGuard)
export class NotificationResolver {
  static readonly NOTIFICATION_SUB = 'notificationSub';

  constructor(private notificationService: NotificationService) {}

  @Subscription((returns) => Notification, {
    filter(payload, variables) {
      return payload.notification.user.id === variables.userId;
    },
    resolve(value) {
      return value.notification;
    },
  })
  @SkipAuth()
  notificationSub(@Args('userId', { type: () => Int }) _userId: number) {
    return pubSub.asyncIterator(NotificationResolver.NOTIFICATION_SUB);
  }

  @Query((returns) => [Notification])
  findNotifications(@CurrentUser() cUser: User) {
    return this.notificationService.findNotifications(cUser);
  }

  @Mutation((returns) => Notification)
  async createNotification(
    @Args('data') data: string,
    @Args('type') type: string,
    @Args('userId', { type: () => Int }) userId?: number,
    // @Args('issueId', { type: () => Int }) issueId?: number,
    // @Args('from', { nullable: true }) from?: 'issue' | 'project',
  ) {
    const notification = await this.notificationService.createNotification(
      data,
      type,
      userId,
    );

    pubSub.publish(NotificationResolver.NOTIFICATION_SUB, {
      notification,
    });

    return notification;
  }

  @Mutation((returns) => Notification)
  async markAsRead(
    @Args('notificationId', { type: () => Int }) notificationId: number,
    @CurrentUser() cUser: User,
  ) {
    return this.notificationService.markAsRead(notificationId, cUser);
  }

  @Mutation((returns) => Int)
  async markAllAsRead(@CurrentUser() cUser: User) {
    return this.notificationService.markAllAsRead(cUser);
  }
}
