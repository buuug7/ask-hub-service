import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { QuestionCreateDto, QuestionUpdateDto } from './questions.dto';
import { Question } from './question.entity';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';
import { createQueryBuilder } from 'typeorm';
import { checkPermission, checkResource, simplePagination } from '../utils';
import { Tag } from '../tags/tag.entity';
import { AnswersService } from '../answers/answers.service';
import { PaginationParam, QuestionSearchParam } from '../app.interface';
import { User } from '../users/user.entity';

@Injectable()
export class QuestionsService {
  constructor(
    private questionsTagsService: QuestionsTagsService,
    @Inject(forwardRef(() => AnswersService))
    private answersService: AnswersService,
  ) {}

  /**
   * return one question with relations
   * @param id
   */
  async view(id: string) {
    const instance = await Question.findOne(id, {
      relations: ['user', 'answers', 'questionTags'],
    });

    checkResource(instance, new Question());

    const tags = instance.questionTags.map((item) => {
      return {
        ...item.tag,
      };
    });

    delete instance.questionTags;

    return {
      ...instance,
      tags: tags,
    };
  }

  /**
   * create question
   * @param data
   */
  async create(data: QuestionCreateDto) {
    const tags = data.tags;

    const question = await Question.save(
      Question.create({
        ...data,
      }),
    );

    await this.addTags(question, tags);
    return this.view(question.id);
  }

  async addTags(question: Question, tags: Tag[]) {
    for (const tag of tags) {
      await this.questionsTagsService.create(question.id, tag.id);
    }
  }

  async update(id: string, data: QuestionUpdateDto, user: Partial<User>) {
    const question = await Question.findOne(id, {
      relations: ['questionTags'],
    });
    checkResource(question, new Question());
    checkPermission(question, user);

    // update
    await Question.merge(question, data).save();
    const newTags = data.tags || [];

    // delete old tags
    for (const questionTag of question.questionTags) {
      await this.questionsTagsService.delete(questionTag.id);
    }

    // add new tags
    if (newTags?.length > 0) {
      await this.addTags(question, newTags);
    }

    return this.view(id);
  }

  async list(queryParam: PaginationParam) {
    const query = createQueryBuilder(Question);
    query.leftJoinAndSelect(
      `Question.user`,
      'User',
      `Question.userId = User.id`,
    );

    // 搜索的时候传递search字段的值需要Json.stringify(search)
    if (queryParam.search) {
      const search = JSON.parse(
        queryParam.search as string,
      ) as QuestionSearchParam;

      if (search.title) {
        query.andWhere(`Question.title like :title`, {
          title: `%${search.title}%`,
        });
      }

      if (search.username) {
        query.andWhere(`User.name = :name`, {
          name: search.username,
        });
      }

      // TODO: 根据createdAt区间查询
      if (search.createdAt) {
        const { op, value } = search.createdAt;
        query.andWhere(`Question.createdAt ${op} :createdAt`, {
          createdAt: value,
        });
      }

      if (search.updatedAt) {
        const { op, value } = search.updatedAt;
        query.andWhere(`Question.updatedAt ${op} :updatedAt`, {
          updatedAt: value,
        });
      }
    }
    query.orderBy('Question_createdAt', 'DESC');

    return simplePagination<Question>(query, queryParam);
  }

  /**
   * delete question with id
   * @param id
   * @param user
   */
  async delete(id: number, user: Partial<User>) {
    const instance = await Question.findOne(id, {
      relations: ['questionTags', 'answers', 'user'],
    });
    checkResource(instance, new Question());
    checkPermission(instance, user);

    // delete the tag associated with question in questions_tags table
    for (const questionTag of instance.questionTags) {
      await this.questionsTagsService.delete(questionTag.id);
    }

    // delete the answers associated with question
    for (const answer of instance.answers) {
      await this.answersService.deleteWithoutPermission(answer.id);
    }

    const rs = await Question.delete(instance.id);
    return rs.affected > 0;
  }

  async getQuestionTags(id: number) {
    const instance = await Question.findOne(id);
    checkResource(instance, new Question());

    return this.questionsTagsService.getTagsByQuestion(instance);
  }

  /**
   * return question without relations
   * @param id
   */
  async findOne(id: string) {
    const instance = await Question.findOne(id);
    checkResource(instance, new Question());

    return instance;
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
