import { Injectable } from '@nestjs/common';
import { QuestionTag } from './question-tag.entity';
import { Question } from '../questions/question.entity';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class QuestionsTagsService {
  async create(question: Question, tag: Tag) {
    //
    return await QuestionTag.save(
      QuestionTag.create({
        question: question,
        tag: tag,
      }),
    );
  }
}
