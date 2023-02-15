import { registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Label } from './label.entity';
import { Member } from './member.entity';
import { Project } from './project.entity';

export enum IssueStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

registerEnumType(IssueStatus, {
  name: 'IssueStatus',
});

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Label, (label) => label.issue)
  labels: Label[];

  @Column({ default: IssueStatus.OPEN })
  issueStatus: IssueStatus;

  @ManyToOne(() => Member, (member) => member.issues)
  owner: Member;

  @ManyToOne(() => Project, (project) => project.issues)
  project: Project;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
