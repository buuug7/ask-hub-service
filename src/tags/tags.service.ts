import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { checkResource } from '../utils';
import { TagUpdateDto } from './tag.dto';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';

@Injectable()
export class TagsService {
  constructor(private questionsTagsService: QuestionsTagsService) {}

  async findOne(id: number) {
    const instance = await Tag.findOne(id);
    checkResource(instance, new Tag());
    return instance;
  }

  async create(createForm) {
    return await Tag.save(Tag.create(createForm));
  }

  async getAllTag() {
    return await Tag.findAndCount();
  }

  async delete(id: number) {
    const instance = await Tag.findOne(id);
    checkResource(instance, new Tag());
    const rs = await Tag.delete(instance.id);
    return rs.affected > 0;
  }

  async update(id: number, data: TagUpdateDto) {
    const instance = await Tag.findOne(id);
    checkResource(instance, new Tag());

    await Tag.merge(instance, data).save();
    return this.findOne(id);
  }

  async getQuestions(tagId: number, queryParam) {
    const instance = await Tag.findOne(tagId);
    checkResource(instance, new Tag());

    return this.questionsTagsService.getQuestionsByTag(instance, queryParam);
  }
}
