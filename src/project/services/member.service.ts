import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-core';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  AddMemberArgs,
  BanMemberArgs,
  ChangeRoleArgs,
} from '../dtos/member.dto';
import { Ban, Member, Role } from '../entities/member.entity';
import { Project } from '../entities/project.entity';
//todo: move all types, interfaces and enums to respective files;
// export interface

export interface findAuthMemberPayload extends User {
  projectId: number;
}

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  async findAuthMember(payload: findAuthMemberPayload) {
    return await this.memberRepository.findOne({
      where: {
        project: {
          id: payload.projectId,
        },
        user: {
          id: payload.id,
        },
      },
      relations: {
        user: true,
        project: true,
      },
    });
  }

  async findMembers(projectId: number) {
    return await this.memberRepository
      .createQueryBuilder('members')
      .leftJoinAndSelect('members.user', 'user')
      .leftJoinAndSelect('members.project', 'project')
      .where('project.id = :projectId', { projectId })
      .orderBy('members.role', 'ASC')
      .getMany();
  }

  async addMember(
    { nextMemberId, projectId }: AddMemberArgs,
    cUser: User,
  ): Promise<Member> {
    const nextMemberExists = await this.userRepository.findOneBy({
      id: nextMemberId,
    });

    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
      },
    });

    const member = await this.memberRepository.findOne({
      where: {
        user: { id: nextMemberId },
        project: { id: projectId },
      },
      relations: {
        user: true,
        project: true,
      },
    });
    if (!nextMemberExists) throw new HttpException('User not found', 404);
    if (!project) throw new HttpException('Project not found', 404);
    if (member)
      throw new HttpException('Member is already in the project!', 400);
    if (nextMemberExists.id === cUser.id)
      throw new UserInputError('You can no be a member of your own project');

    const newMember = this.memberRepository.create({
      user: nextMemberExists,
      project,
    });

    project.membersTotal += 1;

    const [_, memberSaved] = await Promise.all([
      await this.projectRepository.save(project),
      await this.memberRepository.save(newMember),
    ]);
    return memberSaved;
  }

  async banMember(
    { memberWhoBanId, memberToBanId, banType }: BanMemberArgs,
    cUser: User,
  ) {
    const memberWhoBan = await this.memberRepository.findOne({
      where: {
        id: memberWhoBanId,
      },
    });

    const memberToBan = await this.memberRepository.findOne({
      where: {
        id: memberToBanId,
      },
    });

    if (!memberToBan || !memberWhoBan)
      throw new UserInputError('There was an error');

    if (memberToBan.role === Role.ADMIN)
      throw new UnauthorizedException('An admin cannot be banned');

    if (memberWhoBan.role === Role.MEMBER)
      throw new UnauthorizedException('A member cannot ban other members');

    if (memberToBan.ban === banType) {
      memberToBan.ban = Ban.NO_BAN;
      return await this.memberRepository.save(memberToBan);
    }
    memberToBan.ban = banType;

    return await this.memberRepository.save(memberToBan);
  }

  async changeMemberRole({ memberId, roleType }: ChangeRoleArgs) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
      relations: {
        user: true,
        project: {
          owner: true,
        },
      },
    });
    //todo: validate that project owner cannot be modified or deleted
    if (!member) throw new HttpException('Member not found', 404);
    // if (member.ban === Ban.BANNED)
    //   throw new UnauthorizedException(
    //     'You cannot change the role of a banned member',
    //   );
    if (member.user.id === member.project.owner.id)
      throw new UnauthorizedException(
        'The role of the project owner cannot be changed.',
      );
    console.log(member.user, member.project);

    member.role = roleType;
    return await this.memberRepository.save(member);
  }

  async removeMember(memberId: number, projectId: number): Promise<string> {
    const memberExists = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
      relations: {
        user: true,
      },
    });

    const project = await this.projectRepository.findOneBy({ id: projectId });

    if (!memberExists) throw new HttpException('Member not found', 404);
    if (!project) throw new HttpException('Project not found', 404);

    if (project.membersTotal && project.membersTotal !== 0)
      project.membersTotal -= 1;

    const [memberRemoved, _] = await Promise.all([
      await this.memberRepository.delete({ id: memberId }),
      await this.projectRepository.save(project),
    ]);
    if (memberRemoved.affected !== 1)
      throw new HttpException("User couldn't be removed", 400);
    return 'Member removed';
  }
}
