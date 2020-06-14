import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AnswerCreateDto, AnswerUpdateDto } from './answers.dto';
import { Answer } from './answer.entity';
import { checkResource, PaginationParam, simplePagination } from '../utils';
import { QuestionsService } from '../questions/questions.service';
import { createQueryBuilder } from 'typeorm';

@Injectable()
export class AnswersService {
  constructor(
    @Inject(forwardRef(() => QuestionsService))
    private questionsService: QuestionsService,
  ) {}

  /**
   * return one answer with relation
   * @param id
   */
  async view(id: number) {
    const instance = await Answer.findOne(id, {
      relations: ['user', 'question'],
    });
    checkResource(instance, new Answer());

    return instance;
  }

  async create(data: AnswerCreateDto) {
    // throw Exception if no question found
    await this.questionsService.findOne(data.question.id);

    const instance = await Answer.save(
      Answer.create({
        ...data,
        active: true,
      }),
    );

    return this.view(instance.id);
  }

  async update(id: number, data: AnswerUpdateDto) {
    const instance = await Answer.findOne(id);

    checkResource(instance, new Answer());

    await Answer.merge(instance, data).save();
    return this.view(instance.id);
  }

  /**
   * get answers of specified question
   * @param questionId
   * @param queryParam
   */
  async getAnswersByQuestion(questionId: number, queryParam: PaginationParam) {
    const query = createQueryBuilder(Answer);

    query.leftJoinAndSelect('Answer.user', 'User', 'Answer.userId = User.id');
    query.where('Answer.questionId = :questionId', {
      questionId: questionId,
    });

    return simplePagination(query, queryParam);
  }

  async delete(id: number) {
    const instance = await Answer.findOne(id);
    checkResource(instance, new Answer());

    const rs = await Answer.delete(instance.id);
    return rs.affected > 0;
  }
}
