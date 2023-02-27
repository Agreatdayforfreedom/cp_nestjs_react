import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { NotificationType } from '../member.resolver';

@ObjectType()
export class Notification {
  @Field()
  id: number;

  @Field()
  read: boolean;

  @Field()
  data: string;

  @Field()
  type: NotificationType;

  @Field()
  user: User;
}
