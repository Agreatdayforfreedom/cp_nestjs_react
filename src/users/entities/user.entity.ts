import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Member } from '../../project/entities/member.entity';
import { Project } from '../../project/entities/project.entity';
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

  @OneToMany(() => Project, (project) => project.owner)
  project: Project[];

  @OneToMany(() => Member, (member) => member.user)
  memberOf: Member[];
}
