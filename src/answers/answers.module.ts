import { forwardRef, Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { QuestionsModule } from '../questions/questions.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [forwardRef(() => QuestionsModule)],
  controllers: [AnswersController],
  providers: [AnswersService, PrismaService],
  exports: [AnswersService],
})
export class AnswersModule {}
