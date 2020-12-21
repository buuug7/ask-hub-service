import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Question, QuestionTag } from './questions.type';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';
import { createQueryBuilder } from 'typeorm';
import { Tag } from '../tags/tag.entity';
import { AnswersService } from '../answers/answers.service';
import { PaginationParam } from '../app.type';
import { User } from '../users/user.entity';
import DbService from '../db.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as dayjs from 'dayjs';
import { ResultSetHeader } from 'mysql2';
import { Answer } from '../answers/answers.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class QuestionsService {
  constructor(
    private questionsTagsService: QuestionsTagsService,
    @Inject(forwardRef(() => AnswersService))
    private answersService: AnswersService,
    private dbService: DbService,
    private userService: UsersService,
  ) {}

  /**
   * return one question with relations
   * @param id
   */
  async getById(id: string): Promise<Question> {
    // query question
    const sql = `select * from questions where id = ? limit 1`;
    const questions = await this.dbService.execute<Question[]>(sql, [id]);
    return questions[0];
  }

  async getByIdWithRelation(id: string) {
    const question = await this.getById(id);
    const user = await this.userService.findById(question.userId);
    const tags = await this.getTags(question.id);

    return {
      ...question,
      user,
      tags,
    };
  }

  /**
   * create question
   * @param data
   */
  async create(data: Partial<Question>) {
    const sql = `insert into questions(id, title, description, active, createdAt, updatedAt, userId) values (?,?,?,?,?,?,?)`;
    const dateTime = dayjs().format('YYYY-MM-MM HH:mm:ss');
    const id = randomStringGenerator();
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      id,
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
        await this.attachTag(id, tag.id);
      }
    }

    return this.getById(id);
  }

  async isAttachedByGivenTag(questionId, tagId) {
    const sql = `select * from questions_tags where questionId = ? and tagId = ?`;
    const rs = await this.dbService.execute<QuestionTag[]>(sql, [
      questionId,
      tagId,
    ]);
    return rs.length > 0;
  }

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
    const sql = `insert into questions_tags(questionId, tagId) values (?, ?)`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      questionId,
      tagId,
    ]);
    return rs.affectedRows > 0;
  }

  async detachTag(questionId, tagId) {
    const sql = `delete from questions_tags where questionId = ? and tagId = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      questionId,
      tagId,
    ]);

    return rs.affectedRows > 0;
  }

  async update(id: string, data: Partial<Question>) {
    const sql = `update questions set title = ?, description = ?, updatedAt = ? where id = ?`;
    const updatedAt = dayjs().format('YYYY-MM-MM HH:mm:ss');
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

  async getByMostAnswers(limit: number) {
    const query = createQueryBuilder('questions');
    query.addSelect('count(Answer.id)', 'Question_answerCount');
    query.leftJoinAndSelect(
      'Question.user',
      'User',
      'Question.userId = User.id',
    );
    query.leftJoin(
      'Question.answers',
      'Answer',
      'Question.id = Answer.questionId',
    );
    query.groupBy('Question.id');
    query.addOrderBy('Question_answerCount', 'DESC');

    return await query.limit(limit).getMany();
  }

  async list(queryParam: PaginationParam) {
    // const query = createQueryBuilder(Question);
    // query.leftJoinAndSelect(
    //   `Question.user`,
    //   'User',
    //   `Question.userId = User.id`,
    // );
    //
    // // 搜索的时候传递search字段的值需要Json.stringify(search)
    // if (queryParam.search) {
    //   const search = JSON.parse(
    //     queryParam.search as string,
    //   ) as QuestionSearchParam;
    //
    //   if (search.title) {
    //     query.andWhere(`Question.title like :title`, {
    //       title: `%${search.title}%`,
    //     });
    //   }
    //
    //   if (search.username) {
    //     query.andWhere(`User.name = :name`, {
    //       name: search.username,
    //     });
    //   }
    //
    //   // TODO: 根据createdAt区间查询
    //   if (search.createdAt) {
    //     const { op, value } = search.createdAt;
    //     query.andWhere(`Question.createdAt ${op} :createdAt`, {
    //       createdAt: value,
    //     });
    //   }
    //
    //   if (search.updatedAt) {
    //     const { op, value } = search.updatedAt;
    //     query.andWhere(`Question.updatedAt ${op} :updatedAt`, {
    //       updatedAt: value,
    //     });
    //   }
    // }
    // query.orderBy('Question_createdAt', 'DESC');
    //
    // return simplePagination<Question>(query, queryParam);
  }

  /**
   * delete question with id
   * @param id
   * @param user
   */
  async delete(id, user: Partial<User>) {
    const sql = `delete from questions where id = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [id]);

    return rs.affectedRows > 0;
  }

  async getTags(questionId: string) {
    const sql = `select t.*
                  from questions_tags qt
                           left join tags t on qt.tagId = t.id
                  where qt.questionId = ?`;
    return await this.dbService.execute<Tag[]>(sql, [questionId]);
  }

  /**
   * get answers of specified question
   * @param questionId
   */
  async getAnswers(questionId) {
    const sql = `select * from answers where questionId = ?`;
    return await this.dbService.execute<Answer[]>(sql, [questionId]);
  }
}
