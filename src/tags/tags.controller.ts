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

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  async create(@Body() body) {
    return this.tagsService.create(body);
  }

  @Put(':id')
  async update(@Body() body, @Param('id') id) {
    return this.tagsService.update(id, body);
  }

  @Get(':id')
  async view(@Param('id') id) {
    return this.tagsService.getById(id);
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
  async getQuestionByTag(@Param('id') id, @Query() query) {
    return this.tagsService.getQuestions(id);
  }
}
