import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import DbService from '../db.service';

@Module({
  providers: [TagsService, DbService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
