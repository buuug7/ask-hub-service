import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../questions/question.entity';
import { Tag } from '../tags/tag.entity';

/**
 * 问题标签
 */

@Entity({
  name: 'questions_tags',
})
export class QuestionTag extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Question,
    question => question.questionTag,
  )
  question: Question;

  @ManyToOne(
    type => Tag,
    tag => tag.questionTag,
  )
  tag: Tag;
}
