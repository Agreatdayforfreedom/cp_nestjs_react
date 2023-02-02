import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import {
  FindByPageArgs,
  ProjectCreateArgs,
  ProjectUpdateArgs,
} from './dtos/project.dto';
import { Member as MemberModel } from './models/member.model';
import { Pagination, Project as ProjectModel } from './models/project.model';
import { ProjectService } from './services/project.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query((returns) => [ProjectModel])
  findAllProjects() {
    return this.projectService.findAll();
  }

  @Query((returns) => [ProjectModel])
  findMyProjects(@CurrentUser() cUser: User) {
    return this.projectService.findMyProjects(cUser);
  }

  @Query((returns) => [ProjectModel])
  findProjectsMemberOf(@CurrentUser() cUser: User) {
    return this.projectService.findProjectsMemberOf(cUser);
  }

  @Query((returns) => ProjectModel)
  findOneProject(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() cUser: User,
  ) {
    return this.projectService.findOne(id, cUser);
  }

  @Query((returns) => Pagination)
  findProjectByPage(@Args() args: FindByPageArgs, @CurrentUser() cUser: User) {
    return this.projectService.findByPage(args);
  }

  @Mutation((returns) => ProjectModel)
  createProject(@Args() args: ProjectCreateArgs, @CurrentUser() cUser: User) {
    return this.projectService.create(args, cUser);
  }

  @Mutation((returns) => ProjectModel, { nullable: true })
  updateProject(@Args() args: ProjectUpdateArgs, @CurrentUser() cUser: User) {
    return this.projectService.update(args, cUser);
  }

  @Mutation(() => String, { nullable: true })
  deleteProject(@Args('id') id: number, @CurrentUser() cUser: User) {
    return this.projectService.delete(id, cUser);
  }
}
