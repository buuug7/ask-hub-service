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
  async create(@Body() creatForm, @Req() req: Request) {
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
    return this.questionsService.update(id, updateForm, req.user);
  }

  @Get(':id')
  async view(@Param('id') id) {
    return this.questionsService.view(id);
  }

  @Get()
  async list(@Query() queryParam) {
    return this.questionsService.list(queryParam);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id, @Req() req: Request) {
    return this.questionsService.delete(id, req.user);
  }

  @Get(':id/tags')
  async tags(@Param('id') id) {
    return this.questionsService.getQuestionTags(id);
  }

  @Get(':id/answers')
  async answers(@Param('id') id, @Query() query) {
    return this.questionsService.getAnswersByQuestion(id, query);
  }

  @Get('/analysis/getByMostAnswers')
  async getMostAnswered(@Query() queryParam) {
    const limit = queryParam.limit || 10;
    return this.questionsService.getByMostAnswers(limit);
  }
}
