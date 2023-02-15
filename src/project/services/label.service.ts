import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLabelDto } from '../dtos/label.dto';
import { Issue } from '../entities/issue.entity';
import { Label } from '../entities/label.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label) private labelRepository: Repository<Label>,
    @InjectRepository(Issue) private issueRepository: Repository<Issue>,
  ) {}
  async getLabels(issueId: number) {
    return this.labelRepository.find({
      relations: { issue: true },
      where: {
        issue: { id: issueId },
      },
    });
  }

  async newLabel(args: CreateLabelDto) {
    const existsLabel = await this.labelRepository.findOne({
      relations: {
        issue: true,
      },
      where: {
        labelName: args.labelName,
        issue: { id: args.issueId },
      },
    });

    const issue = await this.issueRepository.findOneBy({ id: args.issueId });

    if (!issue) throw new HttpException('Issue not found', 404);

    if (existsLabel)
      throw new HttpException('A label with that name already exists', 400);

    const label = this.labelRepository.create({
      labelName: args.labelName,
      color: args.color,
    });
    label.issue = issue;

    return await this.labelRepository.save(label);
  }
}
