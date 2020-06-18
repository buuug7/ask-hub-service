import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';

export class QuestionCreateDto {
  title: string;
  description: string;
  user: Partial<User> & { id: string };
  tags: Tag[];
}

export class QuestionUpdateDto {
  title?: string;
  description?: string;
  tags?: Tag[];
}
