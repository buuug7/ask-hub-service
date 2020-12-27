import { User } from '../users/users.type';
import { Question } from '../questions/questions.type';

export interface Answer {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  question: Partial<Question>;
  userId: string;
  user: Partial<User>;
}
