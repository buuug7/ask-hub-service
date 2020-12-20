import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { checkResource } from '../utils';
import { QuestionsTagsService } from '../questions-tags/questions-tags.service';
import DbService from '../db.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as dayjs from 'dayjs';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class TagsService {
  constructor(
    private questionsTagsService: QuestionsTagsService,
    private dbService: DbService,
  ) {}

  async getById(id) {
    const sql = `select * from tags where id = ? limit 1`;
    const rs = await this.dbService.execute<Tag[]>(sql, [id]);
    return rs[0];
  }

  async create(data: Partial<Tag>) {
    const sql = `insert into tags(id, name, slug, createdAt, updatedAt) values (?,?,?,?,?)`;
    const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const id = randomStringGenerator();
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [
      id,
      data.name,
      data.slug,
      dateTime,
      dateTime,
    ]);

    return this.getById(id);
  }

  async getAllTag() {
    const sql = `select * from tags`;
    return await this.dbService.execute<Tag[]>(sql, []);
  }

  async delete(id) {
    const sql = `delete from tags where id = ?`;
    const rs = await this.dbService.execute<ResultSetHeader>(sql, [id]);
    return rs.affectedRows > 0;
  }

  async update(id, data: Partial<Tag>) {
    const sql = `update tags set name = ?, slug = ?, updatedAt =? where id =?`;
    const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const rs = this.dbService.execute<ResultSetHeader>(sql, [
      data.name,
      data.slug,
      updatedAt,
      id,
    ]);

    return this.getById(id);
  }

  async getQuestions(tagId: number, queryParam) {
    const instance = await Tag.findOne(tagId);
    checkResource(instance, new Tag());

    return this.questionsTagsService.getQuestionsByTag(instance, queryParam);
  }
}
