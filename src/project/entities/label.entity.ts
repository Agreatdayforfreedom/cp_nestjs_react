import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Issue } from './issue.entity';

@Entity()
export class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 24 })
  labelName: string;

  @Column({ length: 7 })
  color: string;

  @ManyToOne(() => Issue, (issue) => issue.labels, { nullable: true })
  issue: Issue;
}
