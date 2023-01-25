import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Project } from './entities/project.entity';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './services/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), UsersModule],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
