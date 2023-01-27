import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // @Col
}
