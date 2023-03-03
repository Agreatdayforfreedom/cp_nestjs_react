import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueStatus } from '../../interfaces/enums';
import { User } from '../../users/models/user.model';
import { CreateIssueArgs, UpdateIssueArgs } from '../dtos/issue.dto';
import { Issue } from '../entities/issue.entity';
import { Member } from '../models/member.model';
import { MemberService } from './member.service';
import { ProjectService } from './project.service';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue) private issueRepository: Repository<Issue>,
    private memberService: MemberService,
    private projectService: ProjectService,
  ) {}

  /**
   * Find current project issues
   */
  async findIssues(projectId: number) {
    return await this.issueRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
      relations: {
        project: true,
        owner: true,
      },
    });
  }

  async findIssue(issueId: number) {
    const issue = await this.issueRepository.findOne({
      where: {
        id: issueId,
      },
      relations: {
        project: true,
        owner: true,
      },
    });
    if (!issue) throw new HttpException('Issue not found', 404);
    return issue;
  }

  async newIssue(args: CreateIssueArgs, cUser: User) {
    const project = await this.projectService.findOne(args.projectId, cUser);

    const member = await this.memberService.findAuthMember({
      userId: cUser.id,
      projectId: args.projectId,
    });

    if (!member || !project) throw new HttpException("Something's wrong", 400);
    const newIssue = this.issueRepository.create({
      title: args.title,
      description: args.description,
    });

    // if (args.labels?.length > 0) {
    //   newIssue.labels = [...args.labels];
    // }
    newIssue.owner = member;
    newIssue.project = project;

    return await this.issueRepository.save(newIssue);
  }

  async addLabels(issueId: number, labels: number[]) {
    const issue = await this.issueRepository.findOneBy({ id: issueId });

    if (!issue) throw new HttpException('Issue not found', 404);

    //? perhaps do somethis with this
    // const labelsExists = issue.labels.filter((x: Label) => labels.includes(x));

    // const uniqueLabels = labels.filter((x: Label) => !issue.labels.includes(x));

    // if (uniqueLabels.length === 0)
    //   throw new HttpException('There are no new labels to add!', 400);

    // issue.labels = [...issue.labels, ...uniqueLabels];

    return await this.issueRepository.save(issue);
  }

  async updateIssue(args: UpdateIssueArgs, cMember: Member) {
    console.log(args, cMember);
    const issue = await this.issueRepository.findOne({
      where: {
        id: args.id,
      },
      relations: {
        owner: true,
      },
    });
    if (!issue) throw new HttpException('Issue not found', 404);
    if (cMember.id !== issue.owner.id) throw new UnauthorizedException();
    issue.title = args.title || issue.title;
    issue.description = args.description || issue.description;

    return await this.issueRepository.save(issue);
  }

  async closeIssue(issueId: number) {
    const issue = await this.issueRepository.findOneBy({ id: issueId });
    if (!issue) throw new HttpException('Issue not found', 404);
    if (issue.issueStatus === IssueStatus.CLOSED)
      throw new HttpException('Issue is already closed', 400);
    issue.issueStatus = IssueStatus.CLOSED;
    issue.closed_at = new Date();
    return await this.issueRepository.save(issue);
  }
}
