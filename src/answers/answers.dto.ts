export class AnswerCreateDto {
  question: {
    id: string;
  };
  text: string;
  user: { id: string };
}

export class AnswerUpdateDto {
  text?: string;
}
