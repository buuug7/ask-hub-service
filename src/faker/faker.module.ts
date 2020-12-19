import { Module } from '@nestjs/common';
import { FakerService } from './faker.service';
import { FakerController } from './faker.controller';
import { UsersModule } from '../users/users.module';
import { TagsModule } from '../tags/tags.module';
import { QuestionsModule } from '../questions/questions.module';
import { AnswersModule } from '../answers/answers.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [UsersModule, TagsModule, QuestionsModule, AnswersModule],
  providers: [FakerService, PrismaService],
  controllers: [FakerController],
})
export class FakerModule {}
