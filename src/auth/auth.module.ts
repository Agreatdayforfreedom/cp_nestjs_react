import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from '../project/project.module';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { CurrentUser } from './decorators/user.decorator';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule, ProjectModule, JwtModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
