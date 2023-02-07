import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User as UserModel } from '../../users/models/user.model';
import { Ban, Role } from '../entities/member.entity';
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

  @Field((type) => UserModel)
  user: UserModel;

  @Field({ nullable: true })
  notificationType: string;
}
