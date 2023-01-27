import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
