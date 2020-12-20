import { forwardRef, Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionsTagsModule } from '../questions-tags/questions-tags.module';
import { AnswersModule } from '../answers/answers.module';
import DbService from '../db.service';

@Module({
  imports: [forwardRef(() => AnswersModule), QuestionsTagsModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, DbService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
