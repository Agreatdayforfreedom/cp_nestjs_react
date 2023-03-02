import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Issue } from '../entities/issue.entity';
import { Member } from '../entities/member.entity';
import { Member as MemberModel } from '../models/member.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Issue) private issueRepository: Repository<Issue>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  async findComments(issueId: number) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.owner', 'owner')
      .leftJoinAndSelect('comment.issue', 'issue')
      .leftJoinAndSelect('owner.user', 'user')
      .where('issue.id = :id', { id: issueId })
      .orderBy('comment.created_at', 'ASC')
      .getMany();
  }

  async newComment(issueId: number, content: string, cMember: MemberModel) {
    const issueExists = await this.issueRepository.findOneBy({ id: issueId });
    const memberExists = await this.memberRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: cMember.id,
      },
    });
    if (!content) throw new HttpException('The content cannot be empty', 400);

    if (!issueExists || !memberExists)
      throw new HttpException('Issue and/or member not found.', 404);

    const comment = this.commentRepository.create({ content });

    comment.issue = issueExists;
    comment.owner = memberExists;

    return await this.commentRepository.save(comment);
  }

  async updateComment(
    commentId: number,
    content: string,
    cMember: MemberModel,
  ) {
    const comment = await this.commentRepository.findOne({
      relations: { owner: true },
      where: { id: commentId },
    });

    if (cMember.id !== comment.owner.id)
      throw new UnauthorizedException("This comment wasn't issued by you");

    if (!content) throw new HttpException('The content cannot be empty', 400);
    comment.content = content;

    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, cMember: MemberModel) {
    const comment = await this.commentRepository.findOne({
      relations: { owner: true },
      where: { id: commentId },
    });

    if (!comment) throw new HttpException('Comment not found', 404);

    if (cMember.id !== comment.owner.id)
      throw new UnauthorizedException("This comment wasn't issued by you");

    const commentDeleted = await this.commentRepository.delete({
      id: commentId,
    });
    if (commentDeleted.affected !== 1)
      throw new HttpException('Something was wrong', 500);

    return comment;
  }

  async minimizeComment(commentId: number, minimized: boolean) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });

    if (!comment) throw new HttpException('Comment not found', 404);

    if (comment.minimized === minimized && minimized === true) {
      throw new HttpException('The comment is already minimized.', 404);
    }

    comment.minimized = minimized;

    return await this.commentRepository.save(comment);
  }
}
