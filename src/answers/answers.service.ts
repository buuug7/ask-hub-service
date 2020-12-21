import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Answer } from './answers.type';
import { QuestionsService } from '../questions/questions.service';
import DbService from '../db.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as dayjs from 'dayjs';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class AnswersService {
  constructor(
    @Inject(forwardRef(() => QuestionsService))
    private questionsService: QuestionsService,
    private dbService: DbService,
  ) {}

  /**
   * return one answer with relation
   * @param id
   */
  async findById(id: string) {
    const sql = `select *
                 from answers
                 where id = ?
                 limit 1`;
    const rs = await this.dbService.execute<Answer[]>(sql, [id]);
    return rs[0];
  }

  async create(data: Partial<Answer>) {
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
   * get answers of specified question
   * @param questionId
   * @param queryParam
   */
  // async getAnswersByQuestion(questionId: string, queryParam: PaginationParam) {
  //   const query = createQueryBuilder(Answer);
  //
  //   query.leftJoinAndSelect('Answer.user', 'User', 'Answer.userId = User.id');
  //   query.where('Answer.questionId = :questionId', {
  //     questionId: questionId,
  //   });
  //
  //   return simplePagination(query, queryParam);
  // }

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
    const sql = `insert into answers_users_star(answerId, userId) values (?, ?)`;
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
    const isStar = await this.isStarByGivenUser(answerId, userId);

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
    const sql = `select count(*) as count from answers_users_star where answerId = ?`;
    const rs = await this.dbService.execute(sql, [answerId]);
    return rs[0];
  }

  /**
   * determine the answer whether is star by given user
   * @param answerId
   * @param userId
   */
  async isStarByGivenUser(answerId: string, userId: string) {
    const sql = `select *
                 from answers_users_star
                 where answerId = ?
                   and userId = ?`;
    const rs = await this.dbService.execute<Answer[]>(sql, [answerId, userId]);
    return rs.length > 0;
  }
}
