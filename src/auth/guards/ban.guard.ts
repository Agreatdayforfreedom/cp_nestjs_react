import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { Ban } from '../../interfaces/enums';
import { MemberService } from '../../project/services/member.service';

type ExcludeProfileBan = Exclude<Ban, Ban.PROFILE>;

/**
 * Apply restrictions of type:
 * @member `UNBANNED` full access
 * @member `PARTIAL_BAN` restriction to modified(if it is moderator)
 * @member `BANNED` full restriction to write and modified
 */
@Injectable()
export class BanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private memberService: MemberService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const skipAuth = this.reflector.getAllAndOverride<boolean>('SkipAuth', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (skipAuth) {
      return true;
    }
    const bans = this.reflector.getAllAndOverride<Ban[]>('bans', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (bans[0] === Ban.PROFILE) return true;
    // if (ctx.getInfo().operation.operation === 'subscription') return true;
    const member = await this.memberService.findAuthMember({
      userId: req.user.id,
      projectId: req.user.projectId,
    });
    if (member.ban === Ban.UNBANNED) return true;
    const doMatch = this.matchBan(member.ban as ExcludeProfileBan, bans);
    if (doMatch) {
      throw new UnauthorizedException("You don't have enough permissions");
    } else {
      return true;
    }
  }

  private matchBan = (memberBan: ExcludeProfileBan, bans: Ban[]): boolean => {
    const hasPermission = bans.map((b) => b === memberBan);
    return hasPermission.some((h) => h === true);
  };
}
