import { Injectable } from '@nestjs/common';
import { QuestionCreateDto } from './question-create.dto';
import { AuthPayloadUser } from '../auth/auth.interface';
import { Question } from './question.entity';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';
import { createQueryBuilder } from 'typeorm';
import {
  PaginationParam,
  QuestionSearchParam,
  simplePagination,
} from '../utils';

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

    for (const tag of tags) {
      await this.questionsTagsService.create(question, tag);
    }

    return this.getOne(question.id);
  }

  /**
   * return one question with relations
   * @param id
   */
  async getOne(id: number) {
    const instance = await Question.findOne(id, {
      relations: ['user', 'answers', 'questionTags'],
    });

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

    if (queryParam.title) {
      query.andWhere(`Question.title like :title`, {
        title: `%${queryParam.title}%`,
      });
    }

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
