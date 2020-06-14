import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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
  async view(@Param('id') id) {
    return this.tagsService.view(id);
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    return this.tagsService.delete(id);
  }

  @Get()
  async getAll() {
    return this.tagsService.getAllTag();
  }

  @Get(':id/questions')
  async getQuestionByTag(@Param('id') id, @Query() queryParam) {
    return this.tagsService.getQuestions(id, queryParam);
  }
}
