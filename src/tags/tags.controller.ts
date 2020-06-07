import { Body, Controller, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagCreateDto } from './tag-create.dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  async create(@Body() createForm: TagCreateDto) {
    return this.tagsService.create(createForm);
  }
}
