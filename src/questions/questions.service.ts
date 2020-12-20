import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Question } from './questions.type';
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

@Injectable()
export class QuestionsService {
  constructor(
    private questionsTagsService: QuestionsTagsService,
    @Inject(forwardRef(() => AnswersService))
    private answersService: AnswersService,
    private dbService: DbService,
  ) {}

  /**
   * return one question with relations
   * @param id
   */
  async getById(id: string) {
    const sql = `select * from questions where id = ? limit 1`;
    const rs = await this.dbService.execute<Question[]>(sql, [id]);

    return rs[0];

    // const instance = await Question.findOne(id, {
    //   relations: ['user', 'answers', 'questionTags'],
    // });
    //
    // checkResource(instance, new Question());
    //
    // const tags = instance.questionTags.map((item) => {
    //   return {
    //     ...item.tag,
    //   };
    // });
    //
    // delete instance.questionTags;
    //
    // return {
    //   ...instance,
    //   tags: tags,
    // };
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
    console.log('rsquestion', rs);

    return this.getById(id);

    // const tags = data.tags;
    //
    // const question = await Question.save(
    //   Question.create({
    //     ...data,
    //   }),
    // );
    //
    // await this.addTags(question, tags);
    // return this.view(question.id);
  }

  async addTags(question: Question, tags: Tag[]) {
    for (const tag of tags) {
      await this.questionsTagsService.create(question.id, tag.id);
    }
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

    return this.getById(id);
    // const question = await Question.findOne(id, {
    //   relations: ['questionTags'],
    // });
    // checkResource(question, new Question());
    // checkPermission(question, user);
    //
    // // update
    // await Question.merge(question, data).save();
    // const newTags = data.tags || [];
    //
    // // delete old tags
    // for (const questionTag of question.questionTags) {
    //   await this.questionsTagsService.delete(questionTag.id);
    // }
    //
    // // add new tags
    // if (newTags?.length > 0) {
    //   await this.addTags(question, newTags);
    // }
    //
    // return this.view(id);
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

  async getQuestionTags(id: number) {
    // const instance = await Question.findOne(id);
    // checkResource(instance, new Question());
    //
    // return this.questionsTagsService.getTagsByQuestion(instance);
  }

  /**
   * return question without relations
   * @param id
   */
  async findOne(id: string) {
    // const instance = await Question.findOne(id);
    // checkResource(instance, new Question());
    //
    // return instance;
  }

  /**
   * get answers of specified question
   * @param id
   * @param queryParam
   */
  async getAnswersByQuestion(id: string, queryParam: PaginationParam) {
    // check question id is validate
    await this.findOne(id);

    return this.answersService.getAnswersByQuestion(id, queryParam);
  }
}
