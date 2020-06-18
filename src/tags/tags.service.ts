import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { checkResource } from '../utils';
import { TagCreateDto, TagUpdateDto } from './tag.dto';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';

@Injectable()
export class TagsService {
  constructor(private questionsTagsService: QuestionsTagsService) {}

  async view(id: number) {
    const instance = await Tag.findOne(id);
    checkResource(instance, new Tag());
    return instance;
  }

  async create(data: TagCreateDto) {
    return await Tag.save(Tag.create(data));
  }

  async getAllTag() {
    return await Tag.findAndCount();
  }

  async delete(id: number) {
    const instance = await Tag.findOne(id, {
      relations: ['questionTags'],
    });
    checkResource(instance, new Tag());

    // delete the tag associated in questions_tags table
    for (const questionTag of instance.questionTags) {
      await this.questionsTagsService.delete(questionTag.id);
    }

    const rs = await Tag.delete(instance.id);
    return rs.affected > 0;
  }

  async update(id: number, data: TagUpdateDto) {
    const instance = await Tag.findOne(id);
    checkResource(instance, new Tag());

    await Tag.merge(instance, data).save();
    return this.view(id);
  }

  async getQuestions(tagId: number, queryParam) {
    const instance = await Tag.findOne(tagId);
    checkResource(instance, new Tag());

    return this.questionsTagsService.getQuestionsByTag(instance, queryParam);
  }
}
