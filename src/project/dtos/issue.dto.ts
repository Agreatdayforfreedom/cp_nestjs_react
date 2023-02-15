import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ArgsType()
export class CreateIssueArgs {
  @Field()
  @IsString()
  @IsDefined()
  title: string;

  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  projectId: number;

  @Field()
  @IsString()
  @IsDefined()
  description: string;

  @Field((type) => Int, { nullable: true })
  @IsArray()
  @IsOptional()
  labels: number[];
}

@ArgsType()
export class UpdateIssueArgs extends PartialType(CreateIssueArgs) {
  @Field((type) => Int)
  @IsDefined()
  @IsNumber()
  id: number;
}
