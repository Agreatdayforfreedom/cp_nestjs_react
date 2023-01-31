import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Role } from '../../project/entities/member.entity';
import { MemberService } from '../../project/services/member.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private memberService: MemberService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const ctx = GqlExecutionContext.create(context);
    console.log(ctx.getContext(), roles);
    // this.memberService.findAuthMember()
    return true;
  }
}
