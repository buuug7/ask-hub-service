import { forwardRef, Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { AnswersModule } from '../answers/answers.module';
import { DbService } from '../db.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [forwardRef(() => AnswersModule)],
  controllers: [QuestionsController],
  providers: [QuestionsService, DbService, UsersService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
