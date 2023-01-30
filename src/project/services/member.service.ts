import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-core';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Member } from '../entities/member.entity';
import { Project } from '../entities/project.entity';
//todo: move all types, interfaces and enums to respective files;
export interface AddMember {
  nextMemberId: number;
  projectId: number;
}

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  async findMembers(projectId: number) {
    return await this.memberRepository.find({
      where: { project: { id: projectId } },
      relations: {
        project: true,
        user: true,
      },
    });
  }

  async addMember(
    { nextMemberId, projectId }: AddMember,
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

  async removeMember(
    memberId: number,
    projectId: number,
    cUser: User,
  ): Promise<string> {
    console.log(memberId, cUser);
    const memberExists = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
      relations: {
        user: true,
      },
    });
    console.log(memberExists);

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
