import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { QuestionsTagsModule } from '../questions-tags/questions-tags.module';
import DbService from '../db.service';

@Module({
  imports: [QuestionsTagsModule],
  providers: [TagsService, DbService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
