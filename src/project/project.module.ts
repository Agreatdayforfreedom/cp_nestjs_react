import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Member } from './entities/member.entity';
import { Project } from './entities/project.entity';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './services/project.service';
import { MemberResolver } from './member.resolver';
import { MemberService } from './services/member.service';
import { IssueResolver } from './issue.resolver';
import { IssueService } from './services/issue.service';
import { Issue } from './entities/issue.entity';
import { LabelResolver } from './label.resolver';
import { LabelService } from './services/label.service';
import { Label } from './entities/label.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Member, Issue, Label]),
    UsersModule,
  ],
  providers: [
    ProjectResolver,
    ProjectService,
    MemberResolver,
    MemberService,
    IssueResolver,
    IssueService,
    LabelResolver,
    LabelService,
  ],
  exports: [MemberService],
})
export class ProjectModule {}
