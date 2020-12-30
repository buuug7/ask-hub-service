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
import { Request } from 'express';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body, @Req() req: Request) {
    return this.questionsService.create({
      ...body,
      user: req.user,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id,
    @Body() body,
    @Req() req: Request & { user: { id } },
  ) {
    return this.questionsService.update(id, {
      ...body,
      user: {
        id: req.user.id,
      },
    });
  }

  @Get(':id')
  async view(@Param('id') id) {
    return this.questionsService.getByIdWithRelation(id);
  }

  @Get()
  async list(@Query() query) {
    return this.questionsService.list(query);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id, @Req() req: Request) {
    return this.questionsService.delete(id);
  }

  @Get(':id/tags')
  async tags(@Param('id') id) {
    return this.questionsService.getTags(id);
  }

  @Get(':id/answers')
  async answers(@Param('id') id) {
    return this.questionsService.getAnswers(id);
  }

  @Get('/analysis/getHotQuestions')
  async getHostQuestions(@Query() query) {
    const limit = query.limit || 10;
    return this.questionsService.getHotQuestions(limit);
  }
}
