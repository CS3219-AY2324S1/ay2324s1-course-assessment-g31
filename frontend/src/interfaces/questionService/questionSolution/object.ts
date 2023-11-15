export type QuestionSolution = {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  questionId: number;
};

export type QuestionSolutions = {
  solutions: QuestionSolution[];
};
