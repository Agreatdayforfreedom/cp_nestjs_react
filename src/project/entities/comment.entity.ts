import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Issue } from './issue.entity';
import { Member } from './member.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Issue, (issue) => issue.comments, {
    onDelete: 'CASCADE',
  })
  issue: Issue;

  @ManyToOne(() => Member, (member) => member.comments, {
    onDelete: 'SET NULL',
  })
  owner: Member;

  @Column({ default: false })
  minimized: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
