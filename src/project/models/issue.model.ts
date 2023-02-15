import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Label } from './label.model';
import { IssueStatus } from '../entities/issue.entity';

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

  @Field((type) => Date)
  updated_at: Date;

  @Field({ nullable: true })
  notificationType: string;
}
