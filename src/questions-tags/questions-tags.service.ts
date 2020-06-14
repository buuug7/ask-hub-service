import { Injectable } from '@nestjs/common';
import { QuestionTag } from './question-tag.entity';
import { Question } from '../questions/question.entity';
import { Tag } from '../tags/tag.entity';
import { checkResource, PaginationParam, simplePagination } from '../utils';
import { createQueryBuilder } from 'typeorm';

@Injectable()
export class QuestionsTagsService {
  async create(questionId: string, tagId: string) {
    const instance = await this.findOne(questionId, tagId);

    if (instance !== undefined) {
      return Promise.resolve(instance);
    }

    return await QuestionTag.save(
      QuestionTag.create({
        tag: { id: tagId },
        question: { id: questionId },
      }),
    );
  }

  async delete(id: string) {
    const rs = await QuestionTag.delete(id);
    return rs.affected > 0;
  }

  async findOne(questionId: string, tagId: string) {
    return await QuestionTag.findOne({
      where: {
        question: { id: questionId },
        tag: { id: tagId },
      },
    });
  }

  /**
   * get the tags of specified question
   * @param question
   */
  async getTagsByQuestion(question: Question) {
    const rs = await QuestionTag.find({
      where: {
        question: question.id,
      },
      relations: ['tag'],
    });

    return rs.map(item => item.tag);
  }

  async getQuestionsByTag(tag: Tag, queryParam: PaginationParam) {
    const query = createQueryBuilder(QuestionTag);

    query
      .leftJoinAndSelect(
        'QuestionTag.question',
        'Question',
        'QuestionTag.questionId = Question.id',
      )
      .leftJoinAndSelect('Question.user', 'User', 'Question.UserId = User.id')
      .where('QuestionTag.tagId = :tagId', {
        tagId: tag.id,
      });

    const rs = await simplePagination(query, queryParam);
    const data = rs.data.map(item => {
      return {
        ...item.question,
      };
    });

    return {
      ...rs,
      data: data,
    };
  }
}
