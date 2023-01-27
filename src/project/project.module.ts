import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Member } from './entities/member.entity';
import { Project } from './entities/project.entity';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './services/project.service';
import { MemberResolver } from './member.resolver';
import { MemberService } from './services/member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Member]), UsersModule],
  providers: [ProjectResolver, ProjectService, MemberResolver, MemberService],
})
export class ProjectModule {}
