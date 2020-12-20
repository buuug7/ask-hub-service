import { Controller, Get } from '@nestjs/common';
import { User } from '../users/user.entity';
import { hashSync } from 'bcrypt';
import { createQueryBuilder } from 'typeorm';
import { FakerService } from './faker.service';

@Controller('faker')
export class FakerController {
  constructor(private fakerService: FakerService) {}

  @Get('/test')
  test() {
    return this.fakerService.test();
  }

  @Get('/create/users')
  async createUsers() {
    return this.fakerService.createUser();
  }

  @Get('/create/tags')
  async createTags() {
    return this.fakerService.createTags();
  }

  @Get('/create/questions')
  async createQuestions() {
    return this.fakerService.createQuestions();
  }

  @Get('/create/answers')
  async createAnswers() {
    return this.fakerService.createAnswers();
  }
}
