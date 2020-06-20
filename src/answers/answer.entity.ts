import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';
import { UserAnswerStar } from '../users-answers-star/user-answer-star.entity';
import { Exclude } from 'class-transformer';

/**
 * 问题的答案
 */

@Entity({
  name: 'answers',
})
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column()
  createdAt: Date;

  @Column()
  @Exclude()
  updatedAt: Date;

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

  @BeforeInsert()
  beforeInsertQuestion() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdateQuestion() {
    this.updatedAt = new Date();
  }
}
