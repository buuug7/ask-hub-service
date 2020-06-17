import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionTag } from '../questions-tags/question-tag.entity';

/**
 * 标签
 */

@Entity({
  name: 'tags',
})
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(
    type => QuestionTag,
    questionTag => questionTag.tag,
  )
  questionTags: QuestionTag[];

  @BeforeInsert()
  beforeInsertTag() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdateTag() {
    this.updatedAt = new Date();
  }
}
