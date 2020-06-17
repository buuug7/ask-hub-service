import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../questions/question.entity';
import { Answer } from '../answers/answer.entity';
import { UserAnswerStar } from '../users-answers-star/user-answer-star.entity';
import { UserQuestionWatch } from '../users-questions-watches/user-question-watch.entity';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  rememberToken: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  // { github: 'githubId', facebook: 'facebookId', ... }
  // select * from user where email = 'githubEmail@qq.com' and loginFrom -> '$.github' = 'githubId'
  // 如果用户的email等于github返回的email, 并且loginFrom字段存储的github等于github返回过来的ID, 则说明用户已经使用github账户登陆过
  // 直接登陆
  // 否则创建一个新的用户来关联
  @Column({
    type: 'json',
  })
  loginFrom: {
    github?: string;
    facebook?: string;
    qq?: string;
    wechat?: string;
    weibo?: string;
    alipay?: string;
  };

  @OneToMany(
    type => Question,
    question => question.user,
  )
  questions: Question[];

  @OneToMany(
    type => Answer,
    answer => answer.user,
  )
  answers: Answer[];

  @OneToMany(
    type => UserAnswerStar,
    userAnswerStar => userAnswerStar.user,
  )
  userAnswerStars: UserAnswerStar[];

  @OneToMany(
    type => UserQuestionWatch,
    userQuestionWatch => userQuestionWatch.user,
  )
  userQuestionWatches: UserQuestionWatch[];

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
