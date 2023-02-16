import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@ArgsType()
export class CreateLabelDto {
  @Field((type) => Int, { nullable: true })
  // @IsDefined()
  @IsNumber()
  issueId: number;

  @Field()
  @IsDefined()
  @IsString()
  @Length(24)
  labelName: string;

  @Field()
  @IsDefined()
  @IsString()
  @Length(7)
  color: string;
}
