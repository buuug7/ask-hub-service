import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  rememberToken: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
