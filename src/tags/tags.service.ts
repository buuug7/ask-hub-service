import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  async create(createForm) {
    return await Tag.save(Tag.create(createForm));
  }
}
