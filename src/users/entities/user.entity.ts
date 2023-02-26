import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Member } from '../../project/entities/member.entity';
import { Notification } from '../../project/entities/notification.entity';
import { Project } from '../../project/entities/project.entity';
import { RequestProject } from '../../project/entities/requestProject.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: `https://secure.gravatar.com/avatar/${Math.floor(
      Math.random() * 200,
    )}?s=90&d=identicon`,
  })
  avatar: string;

  @OneToMany(() => RequestProject, (requestProject) => requestProject.user)
  requestProject: RequestProject[];

  @OneToMany(() => Project, (project) => project.owner)
  project: Project[];

  @OneToMany(() => Member, (member) => member.user)
  memberOf: Member[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
