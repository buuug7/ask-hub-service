import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  create(@Body() body, @Req() req: Request) {
    return this.answersService.create({
      ...body,
      user: req.user,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id, @Body() body, @Req() req: Request) {
    return this.answersService.update(id, body);
  }

  @Get(':id')
  view(@Param('id') id) {
    return this.answersService.findByIdWithRelation(id);
  }

  @Get(':id/canDelete')
  @UseGuards(AuthGuard('jwt'))
  canDelete(@Param('id') id, @Req() req: Request) {
    return this.answersService.canDelete(id, req.user['id']);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id, @Req() req: Request) {
    return this.answersService.delete(id, req.user['id']);
  }

  @Post(':id/star')
  @UseGuards(AuthGuard('jwt'))
  star(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.star(answerId, req.user['id']);
  }

  @Post(':id/unStar')
  @UseGuards(AuthGuard('jwt'))
  unStar(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.unStar(answerId, req.user['id']);
  }

  @Get(':id/isStarByUser')
  @UseGuards(AuthGuard('jwt'))
  isStarByUser(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.isStarByUser(answerId, req.user['id']);
  }

  @Post(':id/toggleStar')
  @UseGuards(AuthGuard('jwt'))
  toggleStar(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.toggleStar(answerId, req.user['id']);
  }

  @Get(':id/starCount')
  starCount(@Param('id') id) {
    return this.answersService.starCount(id);
  }

  @Get(':id/canUpdate')
  @UseGuards(AuthGuard('jwt'))
  canUpdate(@Param('id') answerId, @Req() req: Request) {
    return this.answersService.canUpdate(answerId, req.user['id']);
  }
}
