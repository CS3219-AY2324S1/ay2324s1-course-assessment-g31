export type QuestionInitialCode = {
  language: string;
  code: string;
  questionId: number;
};

export type OptionalQuestionInitialCode = Partial<QuestionInitialCode>;
