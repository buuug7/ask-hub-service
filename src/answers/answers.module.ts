import { forwardRef, Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { QuestionsModule } from '../questions/questions.module';
import { UsersAnswersStarModule } from '../users-answers-star/users-answers-star.module';

@Module({
  imports: [forwardRef(() => QuestionsModule), UsersAnswersStarModule],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
