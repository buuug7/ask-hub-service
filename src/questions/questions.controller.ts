import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AuthGuard } from '@nestjs/passport';
import { QuestionCreateDto } from './question-create.dto';
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

  @Get(':id')
  async getOne(@Param('id') id) {
    return this.questionsService.getOne(id);
  }

  @Get()
  async list(@Query() queryParam) {
    return this.questionsService.getList(queryParam);
  }
}
