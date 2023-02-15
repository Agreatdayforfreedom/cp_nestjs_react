import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Issue } from './issue.entity';
import { Project } from './project.entity';
export enum Role {
  /**
   * @member PROFILE member is to determine if the guard is accessing from the profile role */
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export enum Ban {
  PROFILE = 'PROFILE',
  UNBANNED = 'UNBANNED',
  PARTIAL_BAN = 'PARTIAL_BAN',
  BANNED = 'BANNED',
}

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
}
