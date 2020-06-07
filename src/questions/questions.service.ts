import { Injectable } from '@nestjs/common';
import { QuestionCreateDto, QuestionUpdateDto } from './questions.dto';
import { AuthPayloadUser } from '../auth/auth.interface';
import { Question } from './question.entity';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';
import { createQueryBuilder } from 'typeorm';
import {
  checkResource,
  PaginationParam,
  QuestionSearchParam,
  simplePagination,
} from '../utils';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class QuestionsService {
  constructor(private questionsTagsService: QuestionsTagsService) {}

  /**
   * create question
   * @param data
   */
  async create(data: QuestionCreateDto & { user: Partial<AuthPayloadUser> }) {
    const tags = data.tags;

    const question = await Question.save(
      Question.create({
        ...data,
        active: true,
      }),
    );

    await this.addTags(question, tags);
    return this.getOne(question.id);
  }

  async addTags(question: Question, tags: Tag[]) {
    for (const tag of tags) {
      await this.questionsTagsService.create(question, tag);
    }
  }

  async update(id: number, data: QuestionUpdateDto) {
    const question = await Question.findOne(id, {
      relations: ['questionTags'],
    });
    checkResource(question, new Question());

    // update
    await Question.merge(question, data).save();

    const newTags = data.tags || [];
    const oldTags = question.questionTags.map(item => item.id);

    // delete old tags
    await this.questionsTagsService.deleteByIds(oldTags);

    // add new tags
    if (newTags?.length > 0) {
      await this.addTags(question, newTags);
    }

    return this.getOne(id);
  }

  /**
   * return one question with relations
   * @param id
   */
  async getOne(id: number) {
    const instance = await Question.findOne(id, {
      relations: ['user', 'answers', 'questionTags'],
    });

    checkResource(instance, new Question());

    const tags = instance.questionTags.map(item => {
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

  async getList(queryParam: PaginationParam) {
    const query = createQueryBuilder(Question);

    query.leftJoinAndSelect(
      `Question.user`,
      'User',
      `Question.userid = User.id`,
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

    query.orderBy('Question_id', 'DESC');

    return simplePagination(query, queryParam);
  }
}
