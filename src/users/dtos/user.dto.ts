// import {} from '@nestjs/mapped-types';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

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

@ArgsType()
export class RefreshTokenArgs {
  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  id: number;

  @Field((type) => Int)
  @IsNumber()
  @IsOptional()
  projectId: number;

  // @Field((type) => Int)
  // @IsNumber()
  // @IsOptional()
  // memberId: number;
}
