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

  @Column({ nullable: true })
  membersTotal: number;

  @Column({ default: false })
  status: boolean;
}
