import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AnswerCreateDto, AnswerUpdateDto } from './answers.dto';
import { Answer } from './answer.entity';
import { checkResource, simplePagination } from '../utils';
import { QuestionsService } from '../questions/questions.service';
import { createQueryBuilder } from 'typeorm';
import { UsersAnswersStarService } from '../users-answers-star/users-answers-star.service';
import { PaginationParam } from '../app.interface';

@Injectable()
export class AnswersService {
  constructor(
    @Inject(forwardRef(() => QuestionsService))
    private questionsService: QuestionsService,
    private usersAnswersStarService: UsersAnswersStarService,
  ) {}

  /**
   * return one answer with relation
   * @param id
   */
  async view(id: string) {
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
  async getAnswersByQuestion(questionId: string, queryParam: PaginationParam) {
    const query = createQueryBuilder(Answer);

    query.leftJoinAndSelect('Answer.user', 'User', 'Answer.userId = User.id');
    query.where('Answer.questionId = :questionId', {
      questionId: questionId,
    });

    return simplePagination(query, queryParam);
  }

  async delete(id: string) {
    const instance = await Answer.findOne(id);
    checkResource(instance, new Answer());

    const rs = await Answer.delete(instance.id);
    return rs.affected > 0;
  }

  /**
   * star answer by given userId
   * @param answerId
   * @param userId
   */
  async star(answerId: string, userId: string) {
    await this.usersAnswersStarService.create(answerId, userId);
    return this.starCount(answerId);
  }

  /**
   * un star answer by given userId
   * @param answerId
   * @param userId
   */
  async unStar(answerId: string, userId: string) {
    const instance = await this.usersAnswersStarService.findOne(
      answerId,
      userId,
    );
    await this.usersAnswersStarService.delete(instance.id);
    return this.starCount(answerId);
  }

  /**
   * toggle star
   * if already star and then unStar, otherwise star
   * @param answerId
   * @param userId
   */
  async toggleStar(answerId: string, userId: string) {
    const isStar = await this.isStarByGivenUser(answerId, userId);

    isStar
      ? await this.unStar(answerId, userId)
      : await this.star(answerId, userId);

    return this.starCount(answerId);
  }

  /**
   * get star count of answer
   * @param answerId
   */
  async starCount(answerId: string) {
    return this.usersAnswersStarService.getUserCountByAnswer(answerId);
  }

  /**
   * determine the answer whether is star by given user
   * @param answerId
   * @param userId
   */
  async isStarByGivenUser(answerId: string, userId: string): Promise<boolean> {
    const instance = await this.usersAnswersStarService.findOne(
      answerId,
      userId,
    );

    return instance !== undefined;
  }
}
