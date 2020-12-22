import { User } from '../users/users.type';
import { Tag } from '../tags/tags.type';

export interface Question {
  id: string;
  title: string;
  description: string;
  active: 1 | 0;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: Partial<User> & { id: string };
  tags: Partial<Tag> & { id: string }[];
  answersCount?: number[];
}

export interface QuestionTag {
  questionId: string;
  tagId: string;
}
