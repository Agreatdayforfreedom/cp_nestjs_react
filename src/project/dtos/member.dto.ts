import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { Ban, Role } from '../entities/member.entity';

@ArgsType()
export class AddMemberArgs {
  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  nextMemberId: number;

  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  projectId: number;
}

@ArgsType()
export class BanMemberArgs {
  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  memberWhoBanId: number;

  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  memberToBanId: number;

  @Field()
  @IsEnum(Ban)
  @IsDefined()
  banType: Ban;
}

@ArgsType()
export class ChangeRoleArgs {
  @Field((type) => Int)
  @IsNumber()
  @IsDefined()
  memberId: number;

  @Field()
  @IsEnum(Role)
  @IsDefined()
  roleType: Role;
}
