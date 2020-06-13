import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { QuestionsTagsModule } from '../questions-tags/questions-tags.module';

@Module({
  imports: [QuestionsTagsModule],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
