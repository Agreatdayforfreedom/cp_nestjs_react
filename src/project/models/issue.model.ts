import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IssueStatus } from '../../interfaces/enums';
import { Label } from './label.model';
import { Member } from './member.model';

@ObjectType()
export class Issue {
  @Field((type) => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field((type) => [Label], { nullable: 'items' })
  labels: Label[];

  @Field((type) => IssueStatus, { defaultValue: IssueStatus.OPEN })
  issueStatus: IssueStatus;

  @Field((type) => Date)
  created_at: Date;

  @Field((type) => Member)
  owner: Member;

  @Field((type) => Date)
  updated_at: Date;

  @Field((type) => Date, { nullable: true })
  closed_at: Date;

  @Field({ nullable: true })
  notificationType: string;
}
