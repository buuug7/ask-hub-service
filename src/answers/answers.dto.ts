export class AnswerCreateDto {
  question: {
    id: string;
  };
  text: string;
}

export class AnswerUpdateDto {
  text?: string;
}
