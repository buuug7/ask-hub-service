import { Injectable } from '@nestjs/common';
import { QuestionTag } from './question-tag.entity';
import { Question } from '../questions/question.entity';
import { Tag } from '../tags/tag.entity';
import { checkResource } from '../utils';

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

  async deleteByIds(id: number[]) {
    if (id.length === 0) {
      return;
    }
    return await QuestionTag.delete(id);
  }

  async delete(question: Question, tag: Tag) {
    const instance = await this.findOne(question, tag);

    if (instance === undefined) {
      return Promise.resolve();
    }

    return await instance.remove();
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
}
