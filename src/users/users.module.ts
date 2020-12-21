import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbService } from '../db.service';

@Module({
  imports: [],
  providers: [UsersService, DbService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
