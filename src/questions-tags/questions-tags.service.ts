import { Injectable } from '@nestjs/common';
import { QuestionTag } from './question-tag.entity';
import { Question } from '../questions/question.entity';
import { Tag } from '../tags/tag.entity';
import { checkResource, PaginationParam, simplePagination } from '../utils';
import { createQueryBuilder } from 'typeorm';

@Injectable()
export class QuestionsTagsService {
  async create(question: Question, tag: Tag) {
    const exists = await this.isExists(question, tag);

    if (exists) {
      return Promise.resolve();
    }

    const _tag = await Tag.findOne(tag);
    checkResource(_tag, new Tag());

    return await QuestionTag.save(
      QuestionTag.create({
        question: question,
        tag: tag,
      }),
    );
  }

  async delete(id: number) {
    const instance = await QuestionTag.findOne(id);
    checkResource(instance, new QuestionTag());

    const rs = await QuestionTag.delete(instance.id);

    return rs.affected > 0;
  }

  async findOne(question: Question, tag: Tag) {
    return await QuestionTag.findOne({
      where: {
        question: question,
        tag: tag,
      },
    });
  }

  async isExists(question: Question, tag: Tag): Promise<boolean> {
    const rs = await this.findOne(question, tag);
    return !!rs;
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
