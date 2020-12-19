import { Injectable } from '@nestjs/common';
import { checkResource } from '../utils';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TagsService {
  constructor(private prismaService: PrismaService) {}

  async getOne(id) {
    return this.prismaService.tag.findUnique({
      where: { id },
    });
  }

  async create(data) {
    // return await Tag.save(Tag.create(data));
    return await this.prismaService.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getAllTag() {
    return await this.prismaService.tag.findMany();
  }

  async delete(id) {
    // const instance = await Tag.findOne(id, {
    //   relations: ['questionTags'],
    // });
    // checkResource(instance, new Tag());
    //
    // // delete the tag associated in questions_tags table
    // for (const questionTag of instance.questionTags) {
    //   await this.questionsTagsService.delete(questionTag.id);
    // }
    //
    // const rs = await Tag.delete(instance.id);
    // return rs.affected > 0;

    return this.prismaService.tag.delete({
      where: { id },
    });
  }

  async update(id, data) {
    // const instance = await Tag.findOne(id);
    // checkResource(instance, new Tag());

    // await Tag.merge(instance, data).save();
    // return this.view(id);

    return this.prismaService.tag.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        slug: data.slug,
        updatedAt: new Date(),
      },
    });
  }

  async getQuestions(id, queryParam) {
    return this.prismaService.tag.findUnique({
      where: {
        id,
      },
      include: {
        questions: true,
      },
    }).questions;

    // const instance = await Tag.findOne(tagId);
    // checkResource(instance, new Tag());
    //
    // return this.questionsTagsService.getQuestionsByTag(instance, queryParam);
  }
}
