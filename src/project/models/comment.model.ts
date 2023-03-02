import { Field, Int, ObjectType } from '@nestjs/graphql';
import { type } from 'os';
import { Issue } from './issue.model';
import { Member } from './member.model';

@ObjectType()
export class Comment {
  @Field((type) => Int)
  id: number;

  @Field()
  content: string;

  @Field((type) => Issue)
  issue: Issue;

  @Field((type) => Member, { nullable: true })
  owner: Member;

  @Field()
  minimized: boolean;

  @Field((type) => Date)
  created_at: Date;

  @Field((type) => Date)
  updated_at: Date;
}
