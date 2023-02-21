import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Issue } from './issue.entity';
import { Member } from './member.entity';
import { RequestProject } from './requestProject.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne((type) => User, (user) => user.project)
  owner: User;

  @OneToMany((type) => Member, (member) => member.project)
  members: Member[];

  @OneToMany(
    (type) => RequestProject,
    (requestProject) => requestProject.project,
  )
  requestProject: RequestProject[];

  @Column({ nullable: true, default: 1 })
  membersTotal: number;

  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[];

  @Column({ default: false })
  status: boolean;
}
