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
}
