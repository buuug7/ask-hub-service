import { BaseEntity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tags } from '../tags/tags.entity';

export class Questions extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  // 问题标题
  @Column()
  title: string;

  // 问题描述
  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  tags: Tags[]
}
