import { Module } from '@nestjs/common';
import { QuestionsTagsService } from './questions-tags.service';

@Module({
  providers: [QuestionsTagsService],
  exports: [QuestionsTagsService],
})
export class QuestionsTagsModule {}
