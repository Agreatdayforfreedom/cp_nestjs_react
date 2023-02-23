import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { RequestStatus } from '../entities/requestProject.entity';
import { Project } from './project.model';

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
});

@ObjectType()
export class RequestProject {
  @Field((type) => Int)
  id: number;

  @Field((type) => RequestStatus)
  requestStatus: RequestStatus;

  @Field((type) => Project)
  project: Project;

  @Field((type) => User)
  user: User;

  @Field({ nullable: true })
  notificationType: string;
}
