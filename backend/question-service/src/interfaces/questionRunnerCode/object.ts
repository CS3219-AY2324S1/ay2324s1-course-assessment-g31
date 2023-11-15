export type QuestionRunnerCode = {
  language: string;
  code: string;
  questionId: number;
};

export type OptionalQuestionRunnerCode = Partial<QuestionRunnerCode>;
