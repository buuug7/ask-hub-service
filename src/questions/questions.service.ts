import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Question, QuestionTag } from './questions.type';
import { AnswersService } from '../answers/answers.service';
import { PaginationParam } from '../app.type';
import { DbService } from '../db.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as dayjs from 'dayjs';
import { ResultSetHeader } from 'mysql2';
import { Answer } from '../answers/answers.type';
import { UsersService } from '../users/users.service';
import { dateTimeFormat, simplePagination } from '../utils';
import { Tag } from '../tags/tags.type';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(forwardRef(() => AnswersService))
    private answersService: AnswersService,
    private dbService: DbService,
    private userService: UsersService,
  ) {}

  /**
   * get question by id without relations
   * @param id
   */
  async getById(id: string): Promise<Question> {
    const sql = `select *
                 from questions
                 where id = ?
                 limit 1`;
    const questions = await this.dbService.execute<Question[]>(sql, [id]);
    return questions[0];
  }

  /**
   * get question with relations
   * @param id
   */
  async getByIdWithRelation(id: string) {
    const question = await this.getById(id);
    const user = await this.userService.findById(question.userId);
    const tags = await this.getTags(question.id);
    const answersCount = await this.getAnswersCount(question.id);

    return {
      ...question,
      user,
      tags,
      answersCount,
    };
  }

  /**
   * create question
   * @param data
   */
  async create(data: Partial<Question>) {
    const sql = `insert into questions(id, title, description, active, createdAt, updatedAt, userId)
                 values (?, ?, ?, ?, ?, ?, ?)`;
    const dateTime = dayjs().format(dateTimeFormat);
    const questionId = randomStringGenerator();
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      questionId,
      data.title,
      data.description,
      '1',
      dateTime,
      dateTime,
      data.user.id,
    ]);

    // attach tag
    if (data.tags.length > 0) {
      for (const tag of data.tags) {
        await this.attachTag(questionId, tag.id);
      }
    }

    return this.getById(questionId);
  }

  async isAttachedByGivenTag(questionId, tagId) {
    const sql = `select *
                 from questions_tags
                 where questionId = ?
                   and tagId = ?`;
    const rs = await this.dbService.execute<QuestionTag[]>(sql, [
      questionId,
      tagId,
    ]);
    return rs.length > 0;
  }

  /**
   * toggle tag
   * if tag is attached then detach
   * @param questionId
   * @param tagId
   */
  async toggleTag(questionId, tagId) {
    const isAttachedByGivenTag = await this.isAttachedByGivenTag(
      questionId,
      tagId,
    );
    if (isAttachedByGivenTag) {
      await this.detachTag(questionId, tagId);
    } else {
      await this.attachTag(questionId, tagId);
    }
  }

  async attachTag(questionId, tagId) {
    const sql = `insert into questions_tags(questionId, tagId)
                 values (?, ?)`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      questionId,
      tagId,
    ]);
    return rs.affectedRows > 0;
  }

  async detachTag(questionId, tagId) {
    const sql = `delete
                 from questions_tags
                 where questionId = ?
                   and tagId = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      questionId,
      tagId,
    ]);

    return rs.affectedRows > 0;
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: string, data: Partial<Question>) {
    const sql = `update questions
                 set title       = ?,
                     description = ?,
                     updatedAt   = ?
                 where id = ?`;
    const updatedAt = dayjs().format(dateTimeFormat);
    const rs = await this.dbService.execute(sql, [
      data.title,
      data.description,
      updatedAt,
      id,
    ]);

    // update related tags
    if (data.tags.length > 0) {
      for (const tag of data.tags) {
        await this.toggleTag(id, tag.id);
      }
    }
    return this.getById(id);
  }

  /**
   *
   * @param queryParam
   */
  async list(queryParam: PaginationParam) {
    return await simplePagination<Question>(
      this.dbService,
      'questions',
      queryParam,
    );
  }

  /**
   * delete question with id
   * @param id
   */
  async delete(id) {
    const sql = `delete
                 from questions
                 where id = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [id]);

    return rs.affectedRows > 0;
  }

  /**
   * get tags by questionId
   * @param questionId
   */
  async getTags(questionId: string) {
    const sql = `select t.*
                 from tags t
                          left join questions_tags qt on t.id = qt.tagId
                 where qt.questionId = ?`;
    return await this.dbService.execute<Tag[]>(sql, [questionId]);
  }

  /**
   * get answers by questionId
   * @param questionId
   */
  async getAnswers(questionId) {
    const sql = `select *
                 from answers
                 where questionId = ? order by updatedAt desc`;
    return await this.dbService.execute<Answer[]>(sql, [questionId]);
  }

  /**
   * get answers count by questionId
   * @param questionsId
   */
  async getAnswersCount(questionsId) {
    const sql = `select count(*) as count from answers where questionId = ?`;
    const [row0] = await this.dbService.execute(sql, [questionsId]);
    return row0['count'];
  }

  /**
   * 获取热门问题
   * 获取条件:
   * 1. 最近一个月
   * 2. 最多回答
   * 3. 倒序
   * @param limit
   */
  async getHotQuestions(limit) {
    const sql = `select q.*, count(a.id) as answers
                 from questions q
                          left join answers a on q.id = a.questionId
                 group by q.id
                 order by answers desc
                 limit ?`;

    const questions = await this.dbService.execute<Question[]>(sql, [
      limit.toString(),
    ]);

    return await Promise.all(
      questions.map(async (question) => {
        const user = await this.userService.findById(question.userId);
        return {
          ...question,
          user,
        };
      }),
    );
  }
}
