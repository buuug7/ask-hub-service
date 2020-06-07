import { Injectable } from '@nestjs/common';
import { QuestionCreateDto } from './question-create.dto';
import { AuthPayloadUser } from '../auth/auth.interface';
import { Question } from './question.entity';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';

@Injectable()
export class QuestionsService {
  constructor(private questionsTagsService: QuestionsTagsService) {}

  /**
   * create question
   * @param data
   */
  async create(data: QuestionCreateDto & { user: Partial<AuthPayloadUser> }) {
    const tags = data.tags;

    const question = await Question.save(
      Question.create({
        ...data,
        active: true,
      }),
    );

    for (const tag of tags) {
      await this.questionsTagsService.create(question, tag);
    }

    return this.getOne(question.id);
  }

  /**
   * return one question with relations
   * @param id
   */
  async getOne(id: number) {
    const instance = await Question.findOne(id, {
      relations: ['user', 'answers', 'questionTags'],
    });

    const tags = instance.questionTags.map(item => {
      return {
        ...item.tag,
      };
    });

    delete instance.questionTags;

    return {
      ...instance,
      tags: tags,
    };
  }
}
