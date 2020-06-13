import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagCreateDto } from './tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  async create(@Body() createForm: TagCreateDto) {
    return this.tagsService.create(createForm);
  }

  @Put(':id')
  async update(@Body() form, @Param('id') id) {
    return this.tagsService.update(id, form);
  }

  @Get(':id')
  async getOne(@Param('id') id) {
    return this.tagsService.findOne(id);
  }

  @Get()
  async getAll() {
    return this.tagsService.getAllTag();
  }
}
