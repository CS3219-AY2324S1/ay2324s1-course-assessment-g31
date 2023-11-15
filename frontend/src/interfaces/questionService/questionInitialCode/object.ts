export type QuestionInitialCode = {
  language: string;
  code: string;
  questionId: number;
};

export type QuestionInitialCodes = {
  initialCodes: QuestionInitialCode[];
};
