export class AnswerCreateDto {
  question: {
    id: number;
  };
  text: string;
}

export class AnswerUpdateDto {
  text?: string;
}
