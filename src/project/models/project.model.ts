import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User as UserModel } from '../../users/models/user.model';
import { Member as MemberModel } from './member.model';

@ObjectType()
export class Project {
  @Field((type) => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field((type) => UserModel)
  owner: UserModel;

  @Field((type) => [MemberModel])
  members: MemberModel;

  @Field((type) => Int, { defaultValue: 0, nullable: true })
  membersTotal: number;

  @Field({ defaultValue: false, nullable: true })
  status: Boolean;
}

@ObjectType()
export class Pagination {
  @Field((type) => [Project])
  projects: Project[];

  @Field()
  endIndex: number;
}
