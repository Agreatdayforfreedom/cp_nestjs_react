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

  @Column({ nullable: true, default: 1 })
  membersTotal: number;

  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[];

  @Column({ default: false })
  status: boolean;
}
