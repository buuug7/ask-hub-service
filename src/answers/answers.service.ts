import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Answer } from './answers.type';
import { QuestionsService } from '../questions/questions.service';
import { DbService } from '../db.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as dayjs from 'dayjs';
import { ResultSetHeader } from 'mysql2';
import { UsersService } from '../users/users.service';

@Injectable()
export class AnswersService {
  constructor(
    @Inject(forwardRef(() => QuestionsService))
    private questionsService: QuestionsService,
    private dbService: DbService,
    private userService: UsersService,
  ) {}

  /**
   * return one answer with relation
   * @param id
   */
  async findById(id: string) {
    const sql = `select *
                 from answers
                 where id = ? limit 1`;
    const rs = await this.dbService.execute<Answer[]>(sql, [id]);
    return rs[0];
  }

  /**
   * get answer with relation
   * @param id
   */
  async findByIdWithRelation(id: string) {
    const answer = await this.findById(id);
    const user = await this.userService.findById(answer.userId);

    return {
      ...answer,
      user,
    };
  }

  /**
   * check if the user already answered the question
   * @param questionId
   * @param userId
   */
  async alreadyAnswered(questionId: string, userId: string) {
    const sql = `select * from answers where questionId =? and userId = ?`;
    const rs = await this.dbService.execute<Answer[]>(sql, [
      questionId,
      userId,
    ]);

    return rs.length > 0;
  }

  async create(data: Partial<Answer>) {
    const alreadyAnswered = await this.alreadyAnswered(
      data.question.id,
      data.user.id,
    );

    if (alreadyAnswered) {
      throw new HttpException('你已经回答该问题了!', HttpStatus.FORBIDDEN);
    }

    const sql = `insert into answers(id, text, active, createdAt, updatedAt, questionId, userId)
                 values (?, ?, ?, ?, ?, ?, ?)`;
    const id = randomStringGenerator();
    const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      id,
      data.text,
      '1',
      dateTime,
      dateTime,
      data.question.id,
      data.user.id,
    ]);

    return this.findById(id);
  }

  async update(id: string, data: Partial<Answer>) {
    const sql = `update answers
                 set text      = ?,
                     updatedAt = ?
                 where id = ?`;
    const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const rs = await this.dbService.execute(sql, [data.text, updatedAt, id]);
    return this.findById(id);
  }

  /**
   * delete resource
   * @param id
   */
  async delete(id: string) {
    const sql = `delete
                 from answers
                 where id = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [id]);
    return rs.affectedRows > 0;
  }

  /**
   * star answer by given userId
   * @param answerId
   * @param userId
   */
  async star(answerId: string, userId: string) {
    const sql = `insert into answers_users_star(answerId, userId)
                 values (?, ?)`;
    const rs = await this.dbService.execute(sql, [answerId, userId]);
    return this.starCount(answerId);
  }

  /**
   * un star answer by given userId
   * @param answerId
   * @param userId
   */
  async unStar(answerId: string, userId: string) {
    const sql = `delete
                 from answers_users_star
                 where answerId = ?
                   and userId = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      answerId,
      userId,
    ]);
    return this.starCount(answerId);
  }

  /**
   * toggle star
   * if already star and then unStar, otherwise star
   * @param answerId
   * @param userId
   */
  async toggleStar(answerId: string, userId: string) {
    const isStar = await this.isStarByUser(answerId, userId);

    isStar
      ? await this.unStar(answerId, userId)
      : await this.star(answerId, userId);

    return this.starCount(answerId);
  }

  /**
   * get star count of answer
   * @param answerId
   */
  async starCount(answerId: string) {
    const sql = `select count(*) as count
                 from answers_users_star
                 where answerId = ?`;
    const rs = await this.dbService.execute(sql, [answerId]);
    return rs[0]['count'];
  }

  /**
   * determine the answer whether is star by user
   * @param answerId
   * @param userId
   */
  async isStarByUser(answerId: string, userId: string) {
    const sql = `select *
                 from answers_users_star
                 where answerId = ?
                   and userId = ?`;
    const rs = await this.dbService.execute<Answer[]>(sql, [answerId, userId]);
    return rs.length > 0;
  }

  /**
   * determine the answer can be updated by given user
   * @param answerId
   * @param userId
   */
  async canUpdate(answerId: string, userId: string) {
    const sql = `select * from answers where id = ? and userId = ?`;
    const rs = await this.dbService.execute<Answer[]>(sql, [answerId, userId]);
    return rs.length > 0;
  }
}
