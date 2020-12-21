import { forwardRef, Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { QuestionsModule } from '../questions/questions.module';
import DbService from '../db.service';

@Module({
  imports: [forwardRef(() => QuestionsModule)],
  controllers: [AnswersController],
  providers: [AnswersService, DbService],
  exports: [AnswersService],
})
export class AnswersModule {}
