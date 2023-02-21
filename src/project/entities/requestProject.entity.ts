import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';

export enum RequestStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

@Entity()
export class RequestProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: RequestStatus, default: RequestStatus.PENDING })
  requestStatus: RequestStatus;

  @ManyToOne(() => Project, (project) => project.requestProject)
  project: Project;

  @ManyToOne(() => User, (user) => user.requestProject)
  user: User;
}