import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true }) //? Securiry?
  password: string;
}
type Project = {
  id: number;
};

@ObjectType()
export class Profile extends User {
  @Field((type) => Int, { nullable: true })
  projectId: number;
}
