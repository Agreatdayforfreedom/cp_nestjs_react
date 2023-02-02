import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../../project/entities/member.entity';
import { MemberService } from '../../project/services/member.service';

type ExcludeProfile = Exclude<Role, Role.PROFILE>[];

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private memberService: MemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<Role[]>('roles', ctx.getHandler());
    const req = ctx.getContext().req;
    const member = await this.memberService.findAuthMember(req.user);
    console.log(roles);
    if (ctx.getHandler().name === 'profile' && roles[0] === Role.PROFILE) {
      req['member'] = member;
      return req && req.member;
    }

    return this.verifyRoles(member.role, roles as ExcludeProfile);
  }

  private verifyRoles(userRole: Role, roles: ExcludeProfile): boolean {
    if (userRole && roles) {
      const hasPermission = roles.map((role: Role) => role === userRole);
      return hasPermission.some((x) => x === true);
    }
  }
}
