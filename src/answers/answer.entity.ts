import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';
import { UserAnswerStar } from '../users-answers-star/user-answer-star.entity';

/**
 * 问题的答案
 */

@Entity({
  name: 'answers',
})
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  active: boolean;

  @ManyToOne(
    type => Question,
    question => question.answers,
  )
  question: Question;

  @ManyToOne(
    type => User,
    user => user.answers,
  )
  user: User;

  @OneToMany(
    type => UserAnswerStar,
    userAnswerStar => userAnswerStar.answer,
  )
  userAnswerStars: UserAnswerStar[];
}
