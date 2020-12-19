import { forwardRef, Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { AnswersModule } from '../answers/answers.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [forwardRef(() => AnswersModule)],
  controllers: [QuestionsController],
  providers: [QuestionsService, PrismaService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
