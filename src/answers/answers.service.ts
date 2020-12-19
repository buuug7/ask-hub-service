import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { QuestionsService } from '../questions/questions.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnswersService {
  constructor(
    @Inject(forwardRef(() => QuestionsService))
    private questionsService: QuestionsService,
    private prismaService: PrismaService,
  ) {}

  /**
   * return one answer with relation
   * @param id
   */
  async view(id: string) {
    // const instance = await Answer.findOne(id, {
    //   relations: ['user', 'question'],
    // });

    // checkResource(instance, new Answer());

    const instance = this.prismaService.answer.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        question: true,
      },
    });

    return instance;
  }

  async create(data) {
    return await this.prismaService.answer.create({
      data: {
        text: data.text,
        createdAt: new Date(),
        updatedAt: new Date(),
        question: {
          connect: data.question,
        },
        user: {
          connect: data.user,
        },
      },
    });

    // throw Exception if no question found
    // await this.questionsService.findOne(data.question.id);
    //
    // const instance = await Answer.save(
    //   Answer.create({
    //     ...data,
    //   }),
    // );
    //
    // return this.view(instance.id);
  }

  async update(id, data, user) {
    // const instance = await Answer.findOne(id);
    //
    // checkResource(instance, new Answer());
    // checkPermission(instance, user);
    //
    // await Answer.merge(instance, data).save();
    // return this.view(instance.id);
    return await this.prismaService.answer.update({
      where: { id },
      data: {
        text: data.text,
      },
    });
  }

  /**
   * delete resource
   * @param id
   * @param user
   */
  async delete(id: string, user) {
    // const instance = await Answer.findOne(id);
    // checkResource(instance, new Answer());
    // checkPermission(instance, user);
    // const rs = await Answer.delete(instance.id);
    // return rs.affected > 0;

    return this.prismaService.answer.delete({
      where: { id },
    });
  }

  /**
   * get answers of specified question
   * @param questionId
   */
  async getAnswersByQuestion(questionId) {
    return this.prismaService.answer.findMany({
      where: {
        questionId,
      },
    });
  }

  /**
   * star answer by given userId
   * @param answerId
   * @param userId
   */
  async star(answerId, userId) {
    // await this.usersAnswersStarService.create(answerId, userId);
    // return this.starCount(answerId);

    await this.prismaService.userAnswerStar.create({
      data: {
        answer: {
          connect: { id: answerId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    return this.starCount(answerId);
  }

  /**
   * un star answer by given userId
   * @param answerId
   * @param userId
   */
  async unStar(answerId: string, userId: string) {
    // const instance = await this.usersAnswersStarService.findOne(
    //   answerId,
    //   userId,
    // );
    // await this.usersAnswersStarService.delete(instance.id);

    await this.prismaService.userAnswerStar.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        userId_answerId: {
          answerId: answerId,
          userId: userId,
        },
      },
    });

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
  async starCount(answerId) {
    // return this.usersAnswersStarService.getUserCountByAnswer(answerId);
    return await this.prismaService.userAnswerStar.findMany({
      where: {
        answerId,
      },
    });
  }

  /**
   * determine the answer whether is star by given user
   * @param answerId
   * @param userId
   */
  async isStarByGivenUser(answerId: string, userId: string): Promise<boolean> {
    // const instance = await this.usersAnswersStarService.findOne(
    //   answerId,
    //   userId,
    // );
    //
    // return instance !== undefined;

    const instance = this.prismaService.userAnswerStar.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        userId_answerId: {
          answerId,
          userId,
        },
      },
    });

    return instance !== null;
  }
}
