import { Injectable } from '@nestjs/common';
import { UserAnswerStar } from './user-answer-star.entity';
import { createQueryBuilder } from 'typeorm';
import { simplePagination } from '../utils';
import { PaginationParam } from '../app.type';

@Injectable()
export class UsersAnswersStarService {
  async create(answerId: string, userId: string) {
    const instance = await this.findOne(answerId, userId);

    if (instance !== undefined) {
      return Promise.resolve(instance);
    }

    return await UserAnswerStar.save(
      UserAnswerStar.create({
        user: { id: userId },
        answer: { id: answerId },
      }),
    );
  }

  async findOne(answerId: string, userId: string) {
    return await UserAnswerStar.findOne({
      where: {
        answer: { id: answerId },
        user: { id: userId },
      },
    });
  }

  async delete(id: string) {
    const rs = await UserAnswerStar.delete(id);
    return rs.affected > 0;
  }

  /**
   * get the star answers of specified user
   * @param userId
   * @param queryParam
   */
  async getAnswersByUser(userId: number, queryParam: PaginationParam) {
    const query = createQueryBuilder(UserAnswerStar);
    query
      .leftJoinAndSelect(
        'UserAnswerStar.answer',
        'Answer',
        'UserAnswerStar.answerId = Answer.id',
      )
      .where('UserAnswerStar.userId = :userId', {
        userId: userId,
      });
    const rs = await simplePagination<UserAnswerStar>(query, queryParam);
    const data = rs.data.map(item => {
      return { ...item.answer };
    });

    return {
      ...rs,
      data: data,
    };
  }

  /**
   * get the users of specified answer
   * @param answerId
   * @param queryParam
   */
  async getUsersByAnswer(answerId: number, queryParam: PaginationParam) {
    const query = createQueryBuilder(UserAnswerStar);
    query
      .leftJoinAndSelect(
        'UserAnswerStar.user',
        'User',
        'UserAnswerStar.userId = User.id',
      )
      .where('UserAnswerStar.answerId = :answerId', {
        answerId: answerId,
      });

    const rs = await simplePagination<UserAnswerStar>(query, queryParam);
    const data = rs.data.map(item => {
      return { ...item.user };
    });

    return {
      ...rs,
      data: data,
    };
  }

  /**
   * get the count of users of specified answer
   * @param answerId
   */
  async getUserCountByAnswer(answerId: string) {
    return await UserAnswerStar.count({
      where: {
        answer: { id: answerId },
      },
    });
  }
}
