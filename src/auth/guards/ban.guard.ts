import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Ban } from '../../project/entities/member.entity';
import { MemberService } from '../../project/services/member.service';

type ExcludeProfileBan = Exclude<Ban, Ban.PROFILE>;

@Injectable()
export class BanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private memberService: MemberService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const member = await this.memberService.findAuthMember(req.user);

    const bans = this.reflector.getAllAndOverride<Ban[]>('bans', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (member.ban === Ban.NO_BAN) return true;
    if (bans[0] === Ban.PROFILE) return true;
    const doMatch = this.matchBan(member.ban as ExcludeProfileBan, bans);
    if (!doMatch) {
      throw new UnauthorizedException("You don't have enough permissions");
    } else {
      return true;
    }
  }

  private matchBan = (memberBan: ExcludeProfileBan, bans: Ban[]): boolean => {
    console.log(memberBan, bans, 'ee');
    const hasPermission = bans.map((b) => b === memberBan);
    return !hasPermission.some((h) => h === true);
  };
}
