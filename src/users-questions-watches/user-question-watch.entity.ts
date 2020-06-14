import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Question } from '../questions/question.entity';

/**
 * 用户关注的问题
 */

@Entity({
  name: 'users-question-watches',
})
export class UserQuestionWatch extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => User,
    user => user.userQuestionWatches,
  )
  user: User;

  @ManyToOne(
    type => Question,
    question => question.userQuestionWatches,
  )
  question: Question;
}
