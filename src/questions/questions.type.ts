import { User } from '../users/users.type';

export interface Question {
  id: string;
  title: string;
  description: string;
  active: 1 | 0;
  createdAt: Date;
  updatedAt: Date;
  user: Partial<User> & { id: string };
}
