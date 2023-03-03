import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-core';
import { DataSource, Repository } from 'typeorm';
import { User as UserModel } from '../../users/models/user.model';
import { User } from '../../users/entities/user.entity';

import { ProjectCreateArgs, ProjectUpdateArgs } from '../dtos/project.dto';
import { Member } from '../entities/member.entity';
import { Project } from '../entities/project.entity';
import { MemberService } from './member.service';
import { RequestProject } from '../entities/requestProject.entity';
import { Role } from '../../interfaces/enums';

export interface Page {
  projects: Project[];
  endIndex: number;
}

@Injectable()
export class ProjectService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
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

  async findOne(id: number, cUser: UserModel) {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        members: true,
      },
    });

    const isMember = await this.memberRepository.findOne({
      where: {
        user: {
          id: cUser.id,
        },
        project: {
          id: project.id,
        },
      },
      relations: {
        user: true,
        project: true,
      },
    });

    if (!isMember)
      throw new UnauthorizedException('You are not a member of this project');

    return project;
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: {
        owner: true,
      },
    });
  }

  async findMyProjects(cUser: User): Promise<Project[]> {
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

  async findProjectsMemberOf(cUser: User): Promise<Project[]> {
    const memberof = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.project', 'project')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('user.id = :id', { id: cUser.id })
      .andWhere('member.role != :role', { role: Role.ADMIN })
      .getMany();

    if (memberof.length < 1)
      throw new HttpException('You are not a member of any project', 400);
    const projectIds = memberof.map((m) => {
      return m.project.id;
    });

    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('project.id IN (:...projectIds)', { projectIds: [...projectIds] })
      .getMany();
  }

  async create(args: ProjectCreateArgs, cUser: User): Promise<Project> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const project = this.projectRepository.create(args);
      project.owner = cUser;
      const projectCreated = await this.projectRepository.save(project);

      const member = this.memberRepository.create({
        user: cUser,
        project: projectCreated,
        role: Role.ADMIN,
      });

      await this.memberRepository.save(member);

      await queryRunner.commitTransaction();
      return project;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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

  async delete(id: number, validateName: string, cUser: User): Promise<number> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!project) throw new HttpException('Project not found', 404);

    if (project.title !== validateName)
      throw new HttpException('Incorrent project name', 400);

    if (project.owner.id !== cUser.id) throw new UnauthorizedException();
    const deleted = await this.projectRepository.delete(id);

    if (deleted.affected !== 1)
      throw new HttpException('Something was wrong', 500);

    return project.id;
  }
}
