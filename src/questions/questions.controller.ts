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
  create(@Body() body, @Req() req: Request) {
    return this.questionsService.create({
      ...body,
      user: req.user,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
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
  view(@Param('id') id) {
    return this.questionsService.getByIdWithRelation(id);
  }

  @Get()
  list(@Query() query) {
    return this.questionsService.list(query);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id, @Req() req: Request) {
    return this.questionsService.delete(id);
  }

  @Get(':id/tags')
  tags(@Param('id') id) {
    return this.questionsService.getTags(id);
  }

  @Get(':id/answers')
  answers(@Param('id') id) {
    return this.questionsService.getAnswers(id);
  }

  @Get('/analysis/getHotQuestions')
  getHostQuestions(@Query() query) {
    const limit = query.limit || 10;
    return this.questionsService.getHotQuestions(limit);
  }

  @Get(':id/canUpdate')
  @UseGuards(AuthGuard('jwt'))
  canUpdate(@Param('id') id, @Req() req: Request) {
    return this.questionsService.canUpdate(id, req.user['id']);
  }
}
