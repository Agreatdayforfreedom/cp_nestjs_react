import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { clearConfigCache } from 'prettier';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const skipAuth = this.reflector.getAllAndOverride<boolean>('SkipAuth', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (skipAuth) {
      return true;
    }
    return super.canActivate(context);
  }
  // handleRequest<TUser = any>(
  //   err: any,
  //   user: any,
  //   info: any,
  //   context: ExecutionContext,
  //   status?: any,
  // ): TUser {
  //   console.log({ err, user, info, context, status });
  //   return;
  // }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // console.log(ctx.getContext(), ctx.getHandler().name);
    const req = ctx.getContext().req;
    // const extra = ctx.getContext().extra;
    return req;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    // console.log({ user, context });
    return user;
  }
}
