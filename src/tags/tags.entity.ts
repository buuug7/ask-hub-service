import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class Tags extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
