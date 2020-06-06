import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Answer } from '../answers/answer.entity';
import { QuestionTag } from '../questions-tags/question-tag.entity';
import { UserQuestionWatch } from '../users-questions-watches/user-question-watch.entity';

/**
 * 问题
 */

@Entity({
  name: 'questions',
})
export class Question extends BaseEntity {
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

  @ManyToOne(
    type => User,
    user => user.questions,
  )
  user: User;

  @OneToMany(
    type => Answer,
    answer => answer.question,
  )
  answers: Answer[];

  @OneToMany(
    type => QuestionTag,
    questionTag => questionTag.question,
  )
  questionTag: QuestionTag[];

  @OneToMany(
    type => UserQuestionWatch,
    userQuestionWatch => userQuestionWatch.question,
  )
  userQuestionWatches: UserQuestionWatch[];
}
