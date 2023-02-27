import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ban, Role } from '../../interfaces/enums';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Issue } from './issue.entity';
import { Project } from './project.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({ nullable: true, default: Role.MEMBER })
  role: Role;

  @Column({ nullable: true, default: Ban.UNBANNED })
  ban: Ban;

  @ManyToOne(() => User, (user) => user.memberOf)
  user: User;

  @OneToMany(() => Issue, (issue) => issue.owner)
  issues: Issue[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];
}
