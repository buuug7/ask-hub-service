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
import { AnswersService } from './answers.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('answers')
export class AnswersController {
  constructor(private answersService: AnswersService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() form, @Req() req: Request) {
    return this.answersService.create({
      ...form,
      user: req.user,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id, @Body() form) {
    return this.answersService.update(id, form);
  }

  @Get(':id')
  async view(@Param('id') id) {
    return this.answersService.view(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id) {
    return this.answersService.delete(id);
  }

  @Post(':id/star')
  @UseGuards(AuthGuard('jwt'))
  async star(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.star(answerId, req.user['id']);
  }

  @Post(':id/unStar')
  @UseGuards(AuthGuard('jwt'))
  async unStar(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.unStar(answerId, req.user['id']);
  }

  @Get(':id/isStarByRequestUser')
  @UseGuards(AuthGuard('jwt'))
  async isAlreadyStar(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.isStarByGivenUser(answerId, req.user['id']);
  }

  @Post(':id/toggleStar')
  @UseGuards(AuthGuard('jwt'))
  async toggleStar(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.toggleStar(answerId, req.user['id']);
  }

  @Get(':id/starCount')
  async starCount(@Param('id') id) {
    return this.answersService.starCount(id);
  }
}
