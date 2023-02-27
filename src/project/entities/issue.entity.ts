import { registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IssueStatus } from '../../interfaces/enums';
import { Comment } from './comment.entity';
import { Label } from './label.entity';
import { Member } from './member.entity';
import { Project } from './project.entity';

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

  @ManyToOne(() => Member, (member) => member.issues, {
    onDelete: 'CASCADE',
  })
  owner: Member;

  @ManyToOne(() => Project, (project) => project.issues, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.issue)
  comments: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
