import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AnswersService } from '../answers/answers.service';
import { PaginationParam, QuestionSearchParam } from '../app.interface';
import { PrismaService } from '../prisma.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(forwardRef(() => AnswersService))
    private answersService: AnswersService,
    private prismaService: PrismaService,
  ) {}

  /**
   * return one question with relations
   * @param id
   */
  async getOne(id: string) {
    return await this.prismaService.question.findUnique({
      where: {
        id: id,
      },
      include: {
        tags: true,
        user: true,
      },
    });
  }

  /**
   * create question
   * @param data
   */
  async create(data) {
    const question = await this.prismaService.question.create({
      data: {
        title: data.title,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          connect: {
            id: data.user.id,
          },
        },
      },
    });

    return question;
    // const questionId = question.id;
    //
    // for (const tag of data.tags) {
    //   await this.prismaService.questionTag.create({
    //     data: {
    //       question: {
    //         connect: {
    //           id: questionId,
    //         },
    //       },
    //       tag: {
    //         connectOrCreate: tag,
    //       },
    //     },
    //   });
    // }
  }

  // async addTags(question: Question, tags: Tag[]) {
  //   for (const tag of tags) {
  //     await this.questionsTagsService.create(question.id, tag.id);
  //   }
  // }

  async update(
    id: string,
    data: Prisma.QuestionUpdateInput & { tags: { id: string }[] },
    user,
  ) {
    const t = data.tags.map((item) => {
      return {
        // eslint-disable-next-line @typescript-eslint/camelcase
        questionId_tagId: {
          questionId: id,
          tagId: item.id,
        },
      };
    });

    return await this.prismaService.question.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        tags: {
          set: [
            ...data.tags.map((item) => {
              return {
                // eslint-disable-next-line @typescript-eslint/camelcase
                questionId_tagId: {
                  questionId: id,
                  tagId: item.id,
                },
              };
            }),
          ],
        },
      },
    });

    // const question = await Question.findOne(id, {
    //   relations: ['questionTags'],
    // });
    // checkResource(question, new Question());
    // checkPermission(question, user);
    //
    // // update
    // await Question.merge(question, data).save();
    // const newTags = data.tags || [];
    //
    // // delete old tags
    // for (const questionTag of question.questionTags) {
    //   await this.questionsTagsService.delete(questionTag.id);
    // }
    //
    // // add new tags
    // if (newTags?.length > 0) {
    //   await this.addTags(question, newTags);
    // }
    //
    // return this.view(id);
  }

  // TODO
  // async getByMostAnswers(limit: number) {
  //   const query = createQueryBuilder('questions');
  //   query.addSelect('count(Answer.id)', 'Question_answerCount');
  //   query.leftJoinAndSelect(
  //     'Question.user',
  //     'User',
  //     'Question.userId = User.id',
  //   );
  //   query.leftJoin(
  //     'Question.answers',
  //     'Answer',
  //     'Question.id = Answer.questionId',
  //   );
  //   query.groupBy('Question.id');
  //   query.addOrderBy('Question_answerCount', 'DESC');
  //
  //   return await query.limit(limit).getMany();
  // }

  async list(queryParam: PaginationParam) {
    console.log(queryParam);

    const perPage = parseInt(String(queryParam.perPage));
    const currentPage = parseInt(String(queryParam.currentPage));

    return await this.prismaService.question.findMany({
      skip: perPage * (currentPage - 1),
      take: perPage,
    });
  }

  // async list(queryParam: PaginationParam) {
  //   const query = createQueryBuilder(Question);
  //   query.leftJoinAndSelect(
  //     `Question.user`,
  //     'User',
  //     `Question.userId = User.id`,
  //   );
  //
  //   // 搜索的时候传递search字段的值需要Json.stringify(search)
  //   if (queryParam.search) {
  //     const search = JSON.parse(
  //       queryParam.search as string,
  //     ) as QuestionSearchParam;
  //
  //     if (search.title) {
  //       query.andWhere(`Question.title like :title`, {
  //         title: `%${search.title}%`,
  //       });
  //     }
  //
  //     if (search.username) {
  //       query.andWhere(`User.name = :name`, {
  //         name: search.username,
  //       });
  //     }
  //
  //     // TODO: 根据createdAt区间查询
  //     if (search.createdAt) {
  //       const { op, value } = search.createdAt;
  //       query.andWhere(`Question.createdAt ${op} :createdAt`, {
  //         createdAt: value,
  //       });
  //     }
  //
  //     if (search.updatedAt) {
  //       const { op, value } = search.updatedAt;
  //       query.andWhere(`Question.updatedAt ${op} :updatedAt`, {
  //         updatedAt: value,
  //       });
  //     }
  //   }
  //   query.orderBy('Question_createdAt', 'DESC');
  //
  //   return simplePagination<Question>(query, queryParam);
  // }

  /**
   * delete question with id
   * @param id
   * @param user
   */
  async delete(id, user /*user: Partial<User>*/) {
    return await this.prismaService.question.delete({
      where: { id },
    });

    // const instance = await Question.findOne(id, {
    //   relations: ['questionTags', 'answers', 'user'],
    // });
    // checkResource(instance, new Question());
    // checkPermission(instance, user);
    //
    // // delete the tag associated with question in questions_tags table
    // for (const questionTag of instance.questionTags) {
    //   await this.questionsTagsService.delete(questionTag.id);
    // }
    //
    // // delete the answers associated with question
    // for (const answer of instance.answers) {
    //   await this.answersService.deleteWithoutPermission(answer.id);
    // }
    //
    // const rs = await Question.delete(instance.id);
    // return rs.affected > 0;
  }

  async getQuestionTags(id) {
    // const instance = await Question.findOne(id);
    // checkResource(instance, new Question());
    //
    // return this.questionsTagsService.getTagsByQuestion(instance);

    return await this.prismaService.question.findUnique({
      where: { id },
      include: { tags: true },
    }).tags;
  }

  /**
   * return question without relations
   * @param id
   */
  async findOne(id: string) {
    // const instance = await Question.findOne(id);
    // checkResource(instance, new Question());
    //
    // return instance;

    return await this.prismaService.question.findUnique({
      where: { id },
    });
  }

  /**
   * get answers of specified question
   * @param id
   */
  async getAnswersByQuestion(id) {
    // check question id is validate
    // await this.findOne(id);
    //
    return this.answersService.getAnswersByQuestion(id);
  }
}
