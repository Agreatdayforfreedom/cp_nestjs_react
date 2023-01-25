import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserModel } from '../../users/models/user.model';

@ObjectType()
export class Auth {
  @Field()
  token: string;

  @Field((type) => UserModel)
  user: UserModel;
}
