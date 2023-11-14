export type QuestionRunnerCodeUpdateDTO = {
  language: string;
  code: string;
};

export type QuestionRunnerCodeUpdateDTOs = {
  runnerCodes: QuestionRunnerCodeUpdateDTO[];
};
