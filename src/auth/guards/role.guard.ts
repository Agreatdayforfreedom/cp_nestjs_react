import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { clearConfigCache } from 'prettier';
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

    // if (ctx.getInfo().operation.operation === 'subscription') return true;
    const skipAuth = this.reflector.getAllAndOverride<boolean>('SkipAuth', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (skipAuth) {
      return true;
    }
    const member = await this.memberService.findAuthMember(req.user);
    if (ctx.getHandler().name === 'profile' && roles[0] === Role.PROFILE) {
      req['member'] = member ?? undefined;
      return req;
    }

    const doMatch = this.verifyRoles(member.role, roles as ExcludeProfile);

    if (doMatch) {
      return doMatch;
    } else {
      throw new UnauthorizedException("You don't have enough permissions");
    }
  }

  private verifyRoles(userRole: Role, roles: ExcludeProfile): boolean {
    if (userRole && roles) {
      const hasPermission = roles.map((role: Role) => role === userRole);
      return hasPermission.some((x) => x === true);
    }
  }
}
