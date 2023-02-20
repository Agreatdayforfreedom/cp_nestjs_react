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
import { Bans } from '../auth/decorators/ban.decorator';
import { CurrentMember } from '../auth/decorators/member.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { SkipAuth } from '../auth/decorators/skipAuth.decorator';
import { BanGuard } from '../auth/guards/ban.guard';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Ban, Role } from './entities/member.entity';
import { Comment } from './models/comment.model';
import { Member } from './models/member.model';
import { CommentService } from './services/comment.service';

export const pubSub = new PubSub();

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard, BanGuard)
@Roles(Role.MEMBER, Role.MODERATOR, Role.ADMIN)
@Bans(Ban.BANNED)
export class CommentResolver {
  static readonly COMMENT_SUB = 'commentSub';

  constructor(private commentService: CommentService) {}

  @Subscription((returns) => Comment, {
    resolve: (value) => {
      console.log(value);
      return value.commentSub;
    },
  })
  @SkipAuth()
  commentSub() {
    return pubSub.asyncIterator(CommentResolver.COMMENT_SUB);
  }

  @Query((returns) => [Comment])
  findComments(@Args('issueId', { type: () => Int }) issueId: number) {
    return this.commentService.findComments(issueId);
  }

  @Mutation((returns) => Comment)
  async newComment(
    @Args('issueId', { type: () => Int }) issueId: number,
    @Args('content') content: string,
    @CurrentMember() cMember: Member,
  ) {
    const newComment = await this.commentService.newComment(
      issueId,
      content,
      cMember,
    );

    pubSub.publish(CommentResolver.COMMENT_SUB, {
      commentSub: newComment,
    });

    return newComment;
  }

  //todo: validate that the current issue is not closed
  @Mutation((returns) => Comment)
  updateComment(
    @Args('commentId', { type: () => Int }) commentId: number,
    @Args('content') content: string,
    @CurrentMember() cMember: Member,
  ) {
    return this.commentService.updateComment(commentId, content, cMember);
  }

  @Mutation((returns) => Comment)
  deleteComment(
    @Args('commentId', { type: () => Int }) commentId: number,
    @CurrentMember() cMember: Member,
  ) {
    return this.commentService.deleteComment(commentId, cMember);
  }
}
