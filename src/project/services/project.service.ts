import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-core';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectCreateArgs, ProjectUpdateArgs } from '../dtos/project.dto';
import { Member } from '../entities/member.entity';
import { Project } from '../entities/project.entity';

export interface Page {
  projects: Project[];
  endIndex: number;
}

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  async findByPage({ offset, limit = 5 }): Promise<Page> {
    const projects = await this.projectRepository
      .createQueryBuilder('pagination')
      .limit(limit)
      .offset(offset)
      .getMany();
    const endIndex: number = await this.projectRepository
      .createQueryBuilder('endIndex')
      .getCount();
    return {
      projects,
      endIndex,
    };
  }

  async findOne(id: number, cUser: User): Promise<Project> {
    return await this.projectRepository.findOne({
      where: {
        id,
        owner: {
          id: cUser.id,
        },
      },
      relations: {
        owner: true,
        members: true,
      },
    });
  }

  async findAll(cUser: User): Promise<Project[]> {
    return await this.projectRepository.find({
      where: {
        owner: {
          id: cUser.id,
        },
      },
      relations: {
        owner: true,
      },
    });
  }

  async create(args: ProjectCreateArgs, cUser: User): Promise<Project> {
    const project = this.projectRepository.create(args);
    project.owner = cUser;
    return await this.projectRepository.save(project);
  }

  async update(args: ProjectUpdateArgs, cUser: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: args.id },
      relations: { owner: true },
    });
    if (!project) throw new HttpException('Project not found', 404);
    if (project.owner.id !== cUser.id) throw new UnauthorizedException();

    const merged = this.projectRepository.merge(project, args);
    return await this.projectRepository.save(merged);
  }

  async delete(id: number, cUser: User): Promise<string> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!project) throw new HttpException('Project not found', 404);
    if (project.owner.id !== cUser.id) throw new UnauthorizedException();
    console.log({ project, cUser });
    const deleted = await this.projectRepository.delete(id);

    if (deleted.affected !== 1)
      throw new HttpException('Something was wrong', 500);

    return 'Deleted successfully';
  }
}
