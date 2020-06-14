import { Module } from '@nestjs/common';
import { UsersAnswersStarService } from './users-answers-star.service';

@Module({
  providers: [UsersAnswersStarService],
  exports: [UsersAnswersStarService]
})
export class UsersAnswersStarModule {}
