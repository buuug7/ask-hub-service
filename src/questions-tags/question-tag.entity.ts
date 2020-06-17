import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../questions/question.entity';
import { Tag } from '../tags/tag.entity';

/**
 * 问题标签
 */

@Entity({
  name: 'questions_tags',
})
export class QuestionTag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => Question,
    question => question.questionTags,
  )
  question: Question;

  @ManyToOne(
    type => Tag,
    tag => tag.questionTags,
    {
      eager: true,
    },
  )
  tag: Tag;
}
