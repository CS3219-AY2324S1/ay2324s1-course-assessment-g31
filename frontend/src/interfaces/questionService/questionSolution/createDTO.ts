export type QuestionSolutionCreateDTO = {
  title: string;
  description: string;
  language: string;
  code: string;
};

export type QuestionSolutionCreateDTOs = {
  solutions: QuestionSolutionCreateDTO[];
};
