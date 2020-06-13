import { Injectable } from '@nestjs/common';
import { AnswerCreateDto, AnswerUpdateDto } from './answers.dto';
import { Answer } from './answer.entity';
import { checkResource } from '../utils';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class AnswersService {
  constructor(private questionsService: QuestionsService) {}

  async getOne(id: number) {
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

    return this.getOne(instance.id);
  }

  async update(id: number, data: AnswerUpdateDto) {
    const instance = await Answer.findOne(id);
    checkResource(instance, new Answer());

    await Answer.merge(instance, data).save();

    return this.getOne(instance.id);
  }

  async delete(id: number) {
    const instance = await Answer.findOne(id);
    checkResource(instance, new Answer());

    const rs = await Answer.delete(instance.id);
    return rs.affected > 0;
  }
}
