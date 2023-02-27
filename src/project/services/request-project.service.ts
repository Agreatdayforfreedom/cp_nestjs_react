import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestStatus } from '../../interfaces/enums';
import { User } from '../../users/entities/user.entity';
import { User as UserModel } from '../../users/models/user.model';
import { Project } from '../entities/project.entity';
import { RequestProject } from '../entities/requestProject.entity';
import { MemberService } from './member.service';

@Injectable()
export class RequestProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RequestProject)
    private requestRepository: Repository<RequestProject>,
    private memberService: MemberService,
  ) {}

  async findCount(projectId: number) {
    return await this.requestRepository.count({
      relations: {
        project: true,
        user: true,
      },
      where: {
        project: {
          id: projectId,
        },
        requestStatus: RequestStatus.PENDING,
      },
    });
  }

  async findRequests(projectId: number) {
    return await this.requestRepository.find({
      relations: {
        project: true,
        user: true,
      },
      where: {
        project: {
          id: projectId,
        },
        requestStatus: RequestStatus.PENDING,
      },
    });
  }

  async requestProject(projectId: number, cUser: UserModel) {
    const user = await this.userRepository.findOneBy({ id: cUser.id });
    const project = await this.projectRepository.findOneBy({ id: projectId });
    const alreadyRequested = await this.requestRepository.findOne({
      relations: {
        user: true,
        project: true,
      },
      where: {
        user: {
          id: user.id,
        },
        project: {
          id: projectId,
        },
        requestStatus: RequestStatus.PENDING,
      },
    });
    // validate that the user is not already in the project
    const isMember = await this.memberService.findAuthMember({
      projectId: projectId,
      userId: cUser.id,
    });
    if (isMember)
      throw new HttpException('You are already a member of this project.', 400);
    if (alreadyRequested)
      throw new HttpException('The request is still pending.', 400);

    const newRequest = new RequestProject();

    newRequest.user = user;
    newRequest.project = project;

    return await this.requestRepository.save(newRequest);
  }

  async alreadyRequested(projectId: number, cUser: UserModel) {
    return await this.requestRepository.findOne({
      relations: {
        user: true,
        project: true,
      },
      where: {
        user: {
          id: cUser.id,
        },
        project: {
          id: projectId,
        },
        requestStatus: RequestStatus.PENDING,
      },
    });
  }

  async acceptOrRejectRequest(
    requestId: number,
    status: Exclude<RequestStatus, RequestStatus.PENDING>,
    cUser: User,
  ) {
    const request = await this.requestRepository.findOne({
      relations: {
        project: true,
        user: true,
      },
      where: {
        id: requestId,
      },
    });

    request.requestStatus = status;
    if (status === RequestStatus.ACCEPTED) {
      //add the user to the project as member;
      const [_, reqSaved] = await Promise.all([
        await this.memberService.addMember(
          {
            nextMemberId: request.user.id,
            projectId: request.project.id,
          },
          cUser,
        ),
        await this.requestRepository.save(request),
      ]);
      return reqSaved;
    }

    return await this.requestRepository.save(request);
  }
}
