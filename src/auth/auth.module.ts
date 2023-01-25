import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { CurrentUser } from './decorators/user.decorator';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule, JwtModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
