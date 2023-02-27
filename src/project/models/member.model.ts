import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Ban, Role } from '../../interfaces/enums';
import { User as UserModel } from '../../users/models/user.model';
import { Project as ProjectModel } from './project.model';

@ObjectType()
export class Member {
  @Field((type) => Int)
  id: number;

  @Field({ defaultValue: Role.MEMBER, nullable: true })
  role: Role;

  @Field({ defaultValue: Ban.UNBANNED, nullable: true })
  ban: Ban;

  @Field((type) => ProjectModel)
  project: ProjectModel;

  @Field((type) => UserModel, { nullable: true })
  user: UserModel;

  @Field({ nullable: true })
  notificationType: string;
}
