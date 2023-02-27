import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

enum NotificationType {
  REJECTED,
  ACCEPTED,
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  read: boolean;

  @Column()
  data: string;

  @Column({ enum: NotificationType, nullable: true })
  type: NotificationType;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
