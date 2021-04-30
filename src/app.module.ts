import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { TagsModule } from './tags/tags.module';
import { AnswersModule } from './answers/answers.module';
import { FakerModule } from './faker/faker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    TagsModule,
    QuestionsModule,
    AnswersModule,
    FakerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
