import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Issue } from './issue.model';

@ObjectType()
export class Label {
  @Field((type) => Int)
  id: number;

  @Field()
  labelName: string;

  @Field()
  color: string;

  @Field((type) => Issue, { nullable: true })
  issue: Issue;
}
