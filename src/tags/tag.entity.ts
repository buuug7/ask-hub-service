import {
  BaseEntity,
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

  @OneToMany(
    type => QuestionTag,
    questionTag => questionTag.tag,
  )
  questionTag: QuestionTag[];
}
