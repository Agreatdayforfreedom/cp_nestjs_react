import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Notification_Type } from '../../interfaces/enums';

@ObjectType()
export class Notification {
  @Field()
  id: number;

  @Field()
  read: boolean;

  @Field()
  data: string;

  @Field()
  type: string;

  @Field()
  user: User;

  @Field()
  created_at: Date;
}
