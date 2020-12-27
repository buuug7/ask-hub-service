import { forwardRef, Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { QuestionsModule } from '../questions/questions.module';
import { DbService } from '../db.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [forwardRef(() => QuestionsModule)],
  controllers: [AnswersController],
  providers: [AnswersService, DbService, UsersService],
  exports: [AnswersService],
})
export class AnswersModule {}
