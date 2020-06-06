import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Answer } from '../answers/answer.entity';

/**
 * 用户点赞的答案
 */

@Entity({
  name: 'users-answers-stars',
})
export class UserAnswerStar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.userAnswerStars,
  )
  user: User;

  @ManyToOne(
    type => Answer,
    answer => answer.userAnswerStars,
  )
  answer: Answer;
}
