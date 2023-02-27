import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RequestStatus } from '../../interfaces/enums';
import { User } from '../../users/models/user.model';
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
