// import {} from '@nestjs/mapped-types';
import { ArgsType, Field } from '@nestjs/graphql';
import { IsDefined, IsString } from 'class-validator';

@ArgsType()
export class UserCreateArgs {
  @Field()
  @IsString()
  @IsDefined()
  username: string;

  @Field()
  @IsString()
  @IsDefined()
  email: string;

  @Field()
  @IsString()
  @IsDefined()
  password: string;
}

@ArgsType()
export class UserLoginArgs {
  @Field()
  @IsString()
  @IsDefined()
  username: string;

  @Field()
  @IsString()
  @IsDefined()
  password: string;
}
