import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
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
import { Exclude } from 'class-transformer';

/**
 * 问题
 */

@Entity({
  name: 'questions',
})
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 问题标题
  @Column()
  title: string;

  // 问题描述
  @Column({
    length: 1024 * 10,
  })
  description: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column()
  createdAt: Date;

  @Column()
  @Exclude()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.questions)
  user: User;

  @OneToMany((type) => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany((type) => QuestionTag, (questionTag) => questionTag.question)
  questionTags: QuestionTag[];

  @OneToMany(
    (type) => UserQuestionWatch,
    (userQuestionWatch) => userQuestionWatch.question,
  )
  userQuestionWatches: UserQuestionWatch[];

  @BeforeInsert()
  beforeInsertQuestion() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdateQuestion() {
    this.updatedAt = new Date();
  }

  @Column({
    generatedType: 'VIRTUAL',
  })
  answerCount: number;

  // private url: string;
  // @AfterLoad()
  // getUrl() {
  //   console.log('this=', this)
  //   this.url = "https://github.com"
  // }
}
