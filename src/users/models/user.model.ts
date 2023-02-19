import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Member } from '../../project/models/member.model';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  avatar: string;

  @Field()
  email: string;

  @Field({ nullable: true }) //? Securiry?
  password: string;
}

@ObjectType()
export class Profile extends User {
  @Field((type) => Int, { nullable: true })
  projectId: number;

  @Field({ nullable: true })
  currentProjectMember: Member;
}
