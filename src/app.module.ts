import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { TagsModule } from './tags/tags.module';
import { AnswersModule } from './answers/answers.module';
import { QuestionsTagsModule } from './questions-tags/questions-tags.module';
import { UsersAnswersStarModule } from './users-answers-star/users-answers-star.module';
import { UsersQuestionsWatchesModule } from './users-questions-watches/users-questions-watches.module';
import { FakerModule } from './faker/faker.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    TagsModule,
    QuestionsModule,
    AnswersModule,
    QuestionsTagsModule,
    UsersAnswersStarModule,
    UsersQuestionsWatchesModule,
    FakerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
