import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AuthGuard } from '@nestjs/passport';
import { QuestionCreateDto, QuestionUpdateDto } from './questions.dto';
import { Request } from 'express';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() creatForm: QuestionCreateDto, @Req() req: Request) {
    return this.questionsService.create({
      ...creatForm,
      user: req.user,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id,
    @Body() updateForm: QuestionUpdateDto,
    @Req() req: Request,
  ) {
    return this.questionsService.update(id, updateForm);
  }

  @Get(':id')
  async getOne(@Param('id') id) {
    return this.questionsService.getOne(id);
  }

  @Get()
  async list(@Query() queryParam) {
    return this.questionsService.getList(queryParam);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id) {
    return this.questionsService.delete(id);
  }

  @Get(':id/tags')
  async tags(@Param('id') id) {
    return this.questionsService.getQuestionTags(id);
  }
}
