import { Tag } from '../tags/tag.entity';

export class QuestionCreateDto {
  title: string;
  description: string;
  tags?: Tag[];
}

export class QuestionUpdateDto {
  title?: string;
  description?: string;
  tags?: Tag[];
}
