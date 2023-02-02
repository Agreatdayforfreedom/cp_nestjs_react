import { Args, ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User as UserModel } from '../../users/models/user.model';

@ArgsType()
export class ProjectCreateArgs {
  @Field()
  @IsString()
  @IsDefined()
  title: string;

  @Field()
  @IsString()
  @IsDefined()
  description: string;
}

@ArgsType()
export class ProjectUpdateArgs extends PartialType(ProjectCreateArgs) {
  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  id: number;
}

@ArgsType()
export class FindByPageArgs {
  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  offset: number;

  @Field((type) => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  limit: number;
}
