import { Injectable } from '@nestjs/common';
import * as faker from 'faker';
import { UsersService } from '../users/users.service';
import { TagsService } from '../tags/tags.service';
import { QuestionsService } from '../questions/questions.service';
import { AnswersService } from '../answers/answers.service';
import { DbService } from '../db.service';
import { Tag } from '../tags/tags.type';

@Injectable()
export class FakerService {
  constructor(
    private userService: UsersService,
    private tagsService: TagsService,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private dbService: DbService,
  ) {}

  /**
   * faker users
   */
  async createUser() {
    const users = [
      {
        name: 'Buuug7',
        email: 'youpp@126.com',
        password: '123456',
        loginFrom: {},
      },
      {
        name: 'WindForce',
        email: 'ask@dev.com',
        password: '123456',
        loginFrom: {},
      },
    ];

    // generate more users
    for (let i = 0; i < 50; i++) {
      users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: '123456',
        loginFrom: {},
      });
    }

    const rs = [];

    for (const user of users) {
      rs.push(await this.userService.create(user));
    }

    return rs;
  }

  /**
   * faker tags
   */
  async createTags() {
    const tags: Tag[] = [];
    for (let i = 0; i < 20; i++) {
      tags.push(
        await this.tagsService.create({
          name: faker.lorem.words(2),
          slug: faker.lorem.slug(2),
        }),
      );
    }

    return tags;
  }

  /**
   * faker questions
   */
  async createQuestions() {
    const user1 = await this.userService.findByEmail("ask@dev.com");
    const user2 = await this.userService.findByEmail("youpp@126.com");

    const tags: Tag[] = await this.tagsService.getAllTag();
    const questions = [];

    for (let i = 0; i < 50; i++) {
      questions.push(
        await this.questionsService.create({
          title: faker.lorem.words(),
          description: faker.lorem.paragraphs(),
          user: { id: i % 2 ? user1.id : user2.id },
          tags: [...tags.slice(0, i % 2 ? 4 : 8)],
        }),
      );
    }

    return questions;
  }

  /**
   * faker answers
   */
  async createAnswers() {
    const { data: questions } = await this.questionsService.list({
      perPage: 5,
    });

    const user1 = await this.userService.findByEmail("ask@dev.com");
    const user2 = await this.userService.findByEmail("youpp@126.com");

    const answers = [];
    for (let i = 0; i < 50; i++) {
      answers.push(
        await this.answersService.create({
          text: faker.lorem.paragraphs(),
          question: i % 2 === 0 ? questions[1] : questions[4],
          user: { id: i % 2 ? user1.id : user2.id },
        }),
      );
    }

    return answers;
  }
}
