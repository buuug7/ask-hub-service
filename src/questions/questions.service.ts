import { Injectable } from '@nestjs/common';
import { QuestionCreateDto } from './question-create.dto';
import { AuthPayloadUser } from '../auth/auth.interface';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {
  async create(data: QuestionCreateDto & { user: Partial<AuthPayloadUser> }) {
    return await Question.save(Question.create({
      ...data,
      active: true
    }));
  }
}
